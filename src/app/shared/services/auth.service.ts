import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { LoginWindowService } from "./login-window.service";
import { RefreshService } from "./refresh.service";
import { UserModel } from "../models/index";
import { TokenAuthService } from "./token-auth.service";
import { LoginService } from "./login.service";
import { environment } from "../../../environments/environment";

@Injectable()
export class AuthService extends TokenAuthService {
  private refresh = inject(RefreshService);
  private loginWindow = inject(LoginWindowService);

  requestLogin(): boolean {
    if (this.sso) {
      // /sso is a virtual path that redirects to SSO
      window.location.href = this.applicationRootUrl + "/sso";
      return true;
    }
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
    if (this.sso && environment.logoutUrl) {
      const url = environment.logoutUrl
        .replace("$base_url", this.applicationRootUrl)
        .replace("$redirect_url", window.location.href);
      window.location.href = url;
    }
  }

  resetUser() {
    super.resetUser();
    this.loginWindow.show();
  }

  private get applicationRootUrl(): string {
    const path = new RegExp(this.router.url + "$");
    return window.location.href.replace(path, "");
  }
}
