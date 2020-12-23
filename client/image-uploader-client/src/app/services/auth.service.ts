import {Injectable} from '@angular/core';
import {UserData} from '../models/UserData';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map, catchError} from 'rxjs/operators';
import {Observable, of} from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({'Content-type': 'application/json'}),
  observe: 'response' as 'response'
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
    if (sessionStorage.getItem('userData') != null) {
      const data = JSON.parse(sessionStorage.getItem('userData'));
      this.userData.userId = data.userId;
      this.userData.token = data.token;
    }
  }

  userData: UserData = {
    userId: '',
    token: ''
  };

  private static setSession(userData: UserData): void {
    sessionStorage.setItem('userData', JSON.stringify(userData));
  }

  verifyAuth(): Observable<boolean> {
    if (this.userData.token != '') {
      return this.http.post(`${environment.apiBaseUrl}/verify`, {token: this.userData.token}, httpOptions).pipe(
        map(res => {
          return true;
        }),
        catchError(err => {
          this.clearSession();
          return of(false);
        })
      );
    } else {
      return of(false);
    }
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http.post(`${environment.apiBaseUrl}/login`, {username, password}, httpOptions).pipe(
      map(res => {
        const response = res.body as { token: string, id: string };
        const userData: UserData = {
          userId: '',
          token: null
        };

        userData.userId = response.id;
        userData.token = response.token;

        if (userData.token != '') {
          AuthService.setSession(userData);
          return true;
        }
        return false;
      }));
  }

  register(username: string, password: string) {
    return this.http.post(`${environment.apiBaseUrl}/register`, {username, password}, httpOptions);
  }

  logout(): void {
    this.clearSession();
  }

  private clearSession(): void {
    sessionStorage.removeItem('userData');
    this.userData = {
      userId: '',
      token: ''
    };
  }
}
