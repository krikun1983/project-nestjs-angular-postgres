import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { FullUser } from './authentication.service';

export interface UserData {
  items: FullUser[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  links: {
    first: string;
    previous: string;
    next: string;
    last: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  findAll(page: number, size: number): Observable<UserData> {
    const params = new HttpParams().set('page', String(page)).set('limit', String(size));

    return this.http.get<UserData>('http://localhost:3000/api/users', { params }).pipe(
      map((userData: UserData) => userData),
      catchError((err: any) => throwError(err))
    );
  }
}
