import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../../app/shared/services/auth.service';
import { LoginWindowService } from '../../../app/shared/services/login-window.service';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private auth: AuthService, private loginWindow: LoginWindowService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean>|Promise<boolean>|boolean {
    const admin = this.auth.isAdmin;
    if (!admin) {
      this.auth.redirectUrl = state.url;
      this.loginWindow.show();
    }
    return admin;
  }

}
