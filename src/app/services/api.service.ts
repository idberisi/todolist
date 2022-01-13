import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
  ) { }

  public apicall(url: string, data: any, token: any = false) {
    return new Promise((resolve, reject) => {
      if (token) {
        this.http.post( environment.serverUrl + url, data, { headers: { Authorization: 'Bearer ' + token } }).subscribe((data: any) => {
          resolve(data);
        });
      } else {
        this.http.post( environment.serverUrl + url, data, {}).subscribe((data: any) => {
          resolve(data);
        });
      }
    });
  }

}
