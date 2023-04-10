import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '../user/models/user.interface';
import { from, Observable, of } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(user: IUser): Observable<string> {
    return from(this.jwtService.signAsync({ user }));
  }

  hashPassword(password: string): Observable<string> {
    return from<string>(bcrypt.hash(password, 12));
  }

  comparePassword(newPassword: string, hashPassword: string): Observable<boolean> {
    return of(bcrypt.compare(newPassword, hashPassword));
  }
}
