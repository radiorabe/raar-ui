import { Injectable, Injector, inject } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpEvent,
  HttpHandler,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from "./auth.service";

const HTTP_UNAUTHORIZED = 401;

@Injectable()
export class RemoteErrorInterceptor implements HttpInterceptor {
  private injector = inject(Injector);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (req.headers.has("Skip-Error-Handling")) {
      return next.handle(
        req.clone({ headers: req.headers.delete("Skip-Error-Handling") }),
      );
    } else {
      return next.handle(req).pipe(catchError((res) => this.handleError(res)));
    }
  }

  private handleError(res: HttpErrorResponse): Observable<HttpEvent<any>> {
    if (res.status === HTTP_UNAUTHORIZED) {
      this.authService.resetUser();
    } else {
      const json = res.error;
      const message = json.error || json.errors || res.message;
      return throwError(message);
    }
  }

  private get authService(): AuthService {
    return this.injector.get(AuthService);
  }
}
