import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private httpClient: HttpClient) { }

  public sendGetRequest(REST_API_SERVER){
    return this.httpClient.get(REST_API_SERVER);
  }

  public sendPostRequest(REST_API_SERVER, REST_API_BODY){
    return this.httpClient.post(REST_API_SERVER, REST_API_BODY);
  }
}
