import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AdminAuthService } from './admin-auth.service';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private auth: AdminAuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean>|Promise<boolean>|boolean {
    return this.auth.isLoggedIn.do(loggedIn => {
      if (!loggedIn) {
        this.auth.redirectUrl = state.url;
        this.router.navigate(['login']);
      }
    });
  }

}
