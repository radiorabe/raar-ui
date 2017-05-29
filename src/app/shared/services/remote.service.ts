import { Injectable } from '@angular/core';
import {
  Http, Headers, RequestOptions, Response,
  RequestOptionsArgs
} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import 'rxjs/Rx';

@Injectable()
export class RemoteService {

  constructor(protected http: Http,
              protected auth: AuthService) {
  }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.http.get(url, this.addRemoteHeaders(options))
      .catch(res => this.handleError(res)) as Observable<Response>;
  }

  protected handleError(res: Response): Observable<Response> {
    let json: any = {};
    try {
      json = res.json();
    } catch (e) {
      console.error(e);
    }
    const message = json.error || json.errors || res.status;
    return Observable.throw(message);
  }

  protected addRemoteHeaders(options?: RequestOptionsArgs): RequestOptionsArgs {
    options = options || new RequestOptions();
    if (!options.headers) options.headers = new Headers();
    options.headers.set('Content-Type', 'application/vnd.api+json');
    this.addAuthToken(options.headers);
    return options;
  }

  protected addAuthToken(headers: Headers) {
    this.auth.addAuthToken(headers);
  }

}
