import { Injectable } from '@angular/core';
import {
  Http, Headers, RequestOptions, Response,
  RequestOptionsArgs
} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { RemoteService } from '../../../app/shared/services/remote.service';
import { AuthService } from '../../../app/shared/services/auth.service';
import 'rxjs/Rx';

@Injectable()
export class AdminRemoteService extends RemoteService {

  constructor(http: Http, auth: AuthService) {
    super(http, auth);
  }

  post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.http.post(url, body, this.addRemoteHeaders(options))
      .catch(err => this.handleUnauthorized(err));
  }

  patch(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.http.patch(url, body, this.addRemoteHeaders(options))
      .catch(err => this.handleUnauthorized(err));
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.http.delete(url, this.addRemoteHeaders(options))
      .catch(err => this.handleUnauthorized(err));
  }

  protected addAuthToken(headers: Headers) {
    this.auth.addAdminAuthToken(headers);
  }

}
