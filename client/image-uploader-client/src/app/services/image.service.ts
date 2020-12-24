import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Image} from '../models/Image';
import {AuthService} from './auth.service';

const httpOptions = {
  headers: new HttpHeaders({'Content-type': 'application/json'}),
  observe: 'response' as 'response'
};

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getImages(): Observable<HttpResponse<Image[]>> {
    return this.http.get<Image[]>(`${environment.apiBaseUrl}/images`, httpOptions);
  }

  getImage(id: string): Observable<HttpResponse<Image>> {
    return this.http.get<Image>(`${environment.apiBaseUrl}/image/${id}`, httpOptions);
  }

  postImage(image: string, name: string, desc: string): Observable<HttpResponse<object>> {
    const options = new HttpHeaders({'Content-type': 'application/json', token: this.authService.userData.token});
    const body = {image, name, desc};
    console.log(body);
    return this.http.post(`${environment.apiBaseUrl}/upload`, body, {headers: options, observe: 'response' as 'response'});
  }

  updateImage(id: string, name: string, desc: string): Observable<HttpResponse<object>> {
    const options = new HttpHeaders({'Content-type': 'application/json', token: this.authService.userData.token});
    return this.http.put(`${environment.apiBaseUrl}/image/${id}`, {name, desc}, {headers: options, observe: 'response' as 'response'});
  }

  deleteImage(id: string): Observable<HttpResponse<object>> {
    const options = new HttpHeaders({'Content-type': 'application/json', token: this.authService.userData.token});
    return this.http.delete(`${environment.apiBaseUrl}/image/${id}`, {headers: options, observe: 'response' as 'response'});
  }
}
