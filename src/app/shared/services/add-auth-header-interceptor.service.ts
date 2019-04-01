import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpEvent,
  HttpHandler,
  HttpHeaders
} from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

export const MEDIA_TYPE_JSON_API = "application/vnd.api+json";

@Injectable()
export class AddAuthHeaderInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(this.transformRequest(req));
  }

  private transformRequest(req: HttpRequest<any>): HttpRequest<any> {
    req = this.addAuthToken(req);
    req = this.setContentType(req);
    return req;
  }

  private setContentType(req: HttpRequest<any>): HttpRequest<any> {
    if (!req.headers.has("Content-Type")) {
      return req.clone({
        headers: req.headers.set("Content-Type", MEDIA_TYPE_JSON_API)
      });
    }
    return req;
  }

  protected addAuthToken(req: HttpRequest<any>): HttpRequest<any> {
    if (!req.headers.has("Authorization")) {
      return req.clone({
        headers: req.headers.set(
          "Authorization",
          'Token token="' + this.auth.token + '"'
        )
      });
    }
    return req;
  }
}
