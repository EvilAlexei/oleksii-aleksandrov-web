import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, finalize, Observable, throwError } from 'rxjs';

import { UserResponse } from '@models/user-response.model';

@Injectable({
  providedIn: 'root'
})
export class UsersSearchService {
  private API_PATH = 'https://api.github.com/search/users';
  private login = '';
  private resultsPerPage = 9;

  constructor(private http: HttpClient) {}

  getUserList(searchValue = '', resultsPerPage = 9): Observable<UserResponse> {
    const searchQuery = searchValue.replace(/\s/g, '+');
    const headers = new HttpHeaders({
      'Accept': 'application/vnd.github+json'
    });
    const params = new HttpParams()
      .set('q', `${searchQuery} in:login`)
      .set('per_page', resultsPerPage)

    return this.http.get<UserResponse>(this.API_PATH, { headers, params })
      .pipe(
        catchError(this.handleError),
        finalize(() => {
          this.login = searchQuery;
          this.resultsPerPage = resultsPerPage;
        })
      );
  }

  getUserListPage(page = 1): Observable<UserResponse> {
    const headers = new HttpHeaders({ 'Accept': 'application/vnd.github+json' });

    return this.http.get<UserResponse>(this.API_PATH, {
      headers,
      params: new HttpParams()
        .set('q', `${this.login} in:login`)
        .set('page', page)
        .set('per_page', this.resultsPerPage)
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
