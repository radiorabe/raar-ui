import { Component } from "@angular/core";
import { AuthService } from "./shared/services/auth.service";
import { LoginWindowService } from "./shared/services/login-window.service";

@Component({
  selector: "sd-app",
  templateUrl: "app.html"
})
export class AppComponent {
  constructor(
    public auth: AuthService,
    private loginWindow: LoginWindowService
  ) {
    auth.isLoggedIn.subscribe();
  }

  showLogin() {
    this.loginWindow.show();
  }
}
