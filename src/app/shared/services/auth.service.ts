import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { LoginWindowService } from "./login-window.service";
import { RefreshService } from "./refresh.service";
import { UserModel } from "../models/index";
import { TokenAuthService } from "./token-auth.service";
import { LoginService } from "./login.service";

@Injectable()
export class AuthService extends TokenAuthService {
  constructor(
    login: LoginService,
    router: Router,
    private refresh: RefreshService,
    private loginWindow: LoginWindowService
  ) {
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
