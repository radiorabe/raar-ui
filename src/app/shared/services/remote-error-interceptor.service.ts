import { Injectable, Injector } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpEvent,
  HttpHandler,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from "./auth.service";

const HTTP_UNAUTHORIZED = 401;

@Injectable()
export class RemoteErrorInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {
    // Get services depending on HttpClient later using injector to avoid cyclic dependency issues
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError(res => this.handleError(res)));
  }

  private handleError(res: HttpErrorResponse): Observable<HttpEvent<any>> {
    if (res.status === HTTP_UNAUTHORIZED) {
      this.authService.resetUser();
    } else {
      const json = res.error;
      const message = json.error || json.errors || res.message;
      return Observable.throw(message);
    }
  }

  private get authService(): AuthService {
    return this.injector.get(AuthService);
  }
}
