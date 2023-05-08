import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

interface Token {
  access_token: string;
}

export interface User {
  email: string;
  password: string;
}

export interface FullUser extends User {
  name: string;
  username: string;
  passwordConfirm: string;
  role?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  public login(user: User) {
    return this.http.post<Token>('http://localhost:3000/api/users/login', { ...user }).pipe(
      map((token) => {
        console.log(token);
        localStorage.setItem('blog_token', token.access_token);
        return token;
      })
    );
  }

  public register(user: FullUser) {
    return this.http.post<FullUser>('http://localhost:3000/api/users', user).pipe(
      map((fullUser) => {
        console.log(fullUser);
        return fullUser;
      })
    );
  }
}
