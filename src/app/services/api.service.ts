import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Http, HttpResponse, HttpHeaders } from '@capacitor-community/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  fallback(url, data, headers) {

    let header: HttpHeaders = headers.headers;
    console.log(header);

    return new Promise((resolve, reject) => {
      Http.request({
        method: 'POST',
        url: environment.serverUrl + url,
        data: data,
        headers: header
      }).then((response: HttpResponse) => {
        resolve( response.data );
      }).catch(e => {
        reject(e);
      });
    });

  }

  public async apicall(url: string, data: any, token: any = false) {

    let headers: any = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }
    }
    if (token) {
      headers = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      };
    }

    console.log(headers);

    const response: any = await this.fallback(url, data, headers);
    return response;
    /* this.httpClient.post(environment.serverUrl + url, data, headers).subscribe((data: any) => {
      resolve(data);
    }); */


  }

}
