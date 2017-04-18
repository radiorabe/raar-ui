import { Injectable } from '@angular/core';
import { Http, URLSearchParams, RequestOptions, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { UserModel } from '../models/user.model';
import 'rxjs/add/operator/map';

@Injectable()
export class LoginService  {

  constructor(protected http: Http) {}

  get(token: string): Observable<UserModel> {
    const options = this.httpOptions({
      'Content-Type': 'application/vnd.api+json',
      'Authorization': 'Token token="' + token + '"'
    });
    return this.http.get('/api/login', options)
      .map(res => this.setUserFromResponse(res));
  }

  post(username: string, password: string): Observable<UserModel> {
    const body = new URLSearchParams();
    body.append('username', username);
    body.append('password', password);
    const options = this.httpOptions({ 'Content-Type': 'application/x-www-form-urlencoded' });

    return this.http.post('/api/login', body.toString(), options)
      .map(res => this.setUserFromResponse(res));
  }

  private httpOptions(headers: any): RequestOptions {
    return new RequestOptions({ headers: new Headers(headers) });
  }

  private setUserFromResponse(res: Response): UserModel {
    const user = new UserModel();
    Object.assign(user, res.json()['data']);
    return user;
  }

}
