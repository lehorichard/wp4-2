import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Image} from '../models/Image';

const httpOptions = {
  headers: new HttpHeaders({'Content-type': 'application/json'}),
  observe: 'response' as 'response'
};

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) {
  }

  getImages(): Observable<HttpResponse<Image[]>> {
    return this.http.get<Image[]>(`${environment.apiBaseUrl}/images`, httpOptions);
  }

  getImage(id: string): Observable<HttpResponse<Image>> {
    return this.http.get<Image>(`${environment.apiBaseUrl}/image/${id}`, httpOptions);
  }
}
