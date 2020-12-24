import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {User} from '../models/User';
import {Image} from '../models/Image';

const httpOptions = {
  headers: new HttpHeaders({'Content-type': 'application/json'}),
  observe: 'response' as 'response'
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  getUsers(): Observable<HttpResponse<User[]>> {
    return this.http.get<User[]>(`${environment.apiBaseUrl}/users`, httpOptions);
  }

  getUserImages(id: string): Observable<HttpResponse<Image[]>> {
    return this.http.get<Image[]>(`${environment.apiBaseUrl}/user/${id}`, httpOptions);
  }
}
