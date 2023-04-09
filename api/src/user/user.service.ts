import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';

import { UserEntity } from './models/user.entity';
import { IUser } from './models/user.interface';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

  createUser(user: IUser): Observable<IUser> {
    return from(this.userRepository.save(user));
  }

  findUser(id: number): Observable<IUser> {
    return from(this.userRepository.findOne({ where: { id } }));
  }
  findUserAll(): Observable<IUser[]> {
    return from(this.userRepository.find());
  }

  updateUser(id: number, user: IUser): Observable<any> {
    return from(this.userRepository.update(id, user));
  }

  deleteOne(id: number): Observable<any> {
    return from(this.userRepository.delete(id));
  }
}
