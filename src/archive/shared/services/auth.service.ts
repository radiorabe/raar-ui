import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { zip } from 'rxjs/observable/zip';
import { LoginWindowService } from './login-window.service';
import { TokenAuthService } from '../../../shared/services/token-auth.service';
import { LoginService } from '../../../shared/services/index';
import { RefreshService } from './refresh.service';
import { UserModel } from '../../../shared/models/index';

@Injectable()
export class AuthService extends TokenAuthService {

  constructor(login: LoginService,
              router: Router,
              private refresh: RefreshService,
              private loginWindow: LoginWindowService) {
    super(login, router);
  }

  setUser(user: UserModel | void) {
    const refresh = !this._redirectUrl;
    super.setUser(user);
    if (refresh) {
      this.refresh.next(undefined);
    }
  }

  logout() {
    super.logout();
    this.refresh.next(undefined);
  }

  resetUser() {
    super.resetUser();
    this.loginWindow.show();
  }

}
