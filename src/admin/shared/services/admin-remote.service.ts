import { Injectable } from '@angular/core';
import {
  Http, Headers, RequestOptions, Response,
  RequestOptionsArgs
} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { RemoteService } from '../../../shared/services/remote.service';
import { AdminAuthService } from './admin-auth.service';

@Injectable()
export class AdminRemoteService extends RemoteService {

  constructor(http: Http, auth: AdminAuthService) {
    super(http, auth);
  }

  post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.http.post(url, body, this.addRemoteHeaders(options))
      .catch(err => this.handleUnauthorized(err));
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.http.delete(url, this.addRemoteHeaders(options))
      .catch(err => this.handleUnauthorized(err));
  }

}
