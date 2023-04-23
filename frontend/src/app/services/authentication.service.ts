import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

interface IToken {
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<IToken>('http://localhost:3000/api/users/login', { email, password }).pipe(
      map((token) => {
        console.log(token);
        localStorage.setItem('blog_token', token.access_token);
        return token;
      })
    );
  }
}
