import { Injectable } from '@angular/core';
import {
  Http, Headers, RequestOptions, Response,
  RequestOptionsArgs
} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { TokenAuthService } from './token-auth.service';

export const MEDIA_TYPE_JSON_API = 'application/vnd.api+json';
export const HTTP_UNAUTHORIZED = 401;

@Injectable()
export class RemoteService {

  constructor(protected http: Http,
              protected auth: TokenAuthService) {
  }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.http.get(url, this.addRemoteHeaders(options))
      .catch(err => this.handleUnauthorized(err));
  }

  protected addRemoteHeaders(options?: RequestOptionsArgs): RequestOptionsArgs {
    options = options || new RequestOptions();
    if (!options.headers) options.headers = new Headers();
    options.headers.set('Content-Type', MEDIA_TYPE_JSON_API);
    this.addAuthToken(options.headers);
    return options;
  }

  protected addAuthToken(headers: Headers) {
    this.auth.addAuthToken(headers);
  }

  protected handleUnauthorized(error: Response): Observable<Response> {
    if (error.status === HTTP_UNAUTHORIZED) {
      this.auth.resetUser();
    }

    return Observable.throw(error);
  }

}
