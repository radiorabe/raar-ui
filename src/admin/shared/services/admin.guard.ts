import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../../app/shared/services/auth.service';
import { LoginWindowService } from '../../../app/shared/services/login-window.service';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean>|Promise<boolean>|boolean {
    return this.auth.isAdminLoggedIn.do(loggedIn => {
      if (!loggedIn) {
        this.auth.redirectUrl = state.url;
        this.router.navigate(['login']);
      }
    });
  }

}
