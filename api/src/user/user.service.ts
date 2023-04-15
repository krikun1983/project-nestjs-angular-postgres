import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { Repository } from 'typeorm';

import { UserEntity } from './models/user.entity';
import { IUser } from './models/user.interface';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    private readonly authService: AuthService
  ) {}

  createUser(user: IUser): Observable<IUser> {
    return this.authService.hashPassword(user.password).pipe(
      switchMap((hashPassword: string) => {
        const newUser = new UserEntity();
        newUser.name = user.name;
        newUser.username = user.username;
        newUser.email = user.email;
        newUser.password = hashPassword;
        newUser.role = user.role;

        return from(this.userRepository.save(newUser)).pipe(
          map((user: IUser) => {
            const { password, ...rest } = user;
            return rest;
          }),
          catchError((err) => throwError(err))
        );
      })
    );
  }

  findUser(id: number): Observable<IUser> {
    return from(this.userRepository.findOne({ where: { id } })).pipe(
      map((user: IUser) => {
        const { password, ...rest } = user;
        return rest;
      })
    );
  }
  findUserAll(): Observable<IUser[]> {
    return from(this.userRepository.find()).pipe(
      map((users: IUser[]) => {
        users.forEach((user: IUser) => delete user.password);
        return users;
      })
    );
  }

  updateUser(id: number, user: IUser): Observable<any> {
    delete user.email;
    delete user.password;

    return from(this.userRepository.update(id, user)).pipe(switchMap(() => this.findUser(id)));
  }

  deleteOne(id: number): Observable<any> {
    return from(this.userRepository.delete(id));
  }

  login(user: IUser): Observable<string> {
    return this.validateUser(user?.email, user?.password).pipe(
      switchMap((user: IUser) => {
        if (user) {
          return this.authService.generateToken(user).pipe(map((token: string) => token));
        } else {
          return 'Неправильные учетные данные';
        }
      })
    );
  }

  updateRoleOfUser(id: number, user: IUser): Observable<any> {
    return from(this.userRepository.update(id, user));
  }

  validateUser(email: string, password: string): Observable<IUser> {
    return this.findUserByEmail(email).pipe(
      switchMap((user: IUser) =>
        this.authService.comparePassword(password, user.password).pipe(
          map((match: boolean) => {
            if (match) {
              const { password, ...rest } = user;
              return rest;
            } else {
              throw Error;
            }
          })
        )
      )
    );
  }

  findUserByEmail(email: string): Observable<IUser> {
    return from(this.userRepository.findOne({ where: { email } }));
  }
}
