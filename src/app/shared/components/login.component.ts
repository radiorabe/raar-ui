import { Component, ViewChild, inject } from "@angular/core";
import { AuthService } from "../../shared/services/auth.service";
import { LoginWindowService } from "../../shared/services/login-window.service";
import { UserModel } from "../models/user.model";
import { LoginService } from "../services/login.service";
import { SmallModalComponent } from "./small-modal.component";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "sd-login",
  templateUrl: "login.html",
  imports: [SmallModalComponent, FormsModule],
})
export class LoginComponent {
  private login = inject(LoginService);
  private auth = inject(AuthService);
  private loginWindow = inject(LoginWindowService);

  @ViewChild("modal", { static: true }) modal: SmallModalComponent;

  username: string;
  password: string;
  accessCode: string;
  checking: boolean = false;
  failure: boolean = false;
  userLogin: boolean = false;

  constructor() {
    this.loginWindow.show$.subscribe(this.show.bind(this));
  }

  show(userLogin: boolean = false) {
    if (userLogin && this.auth.requestLogin()) return;
    this.userLogin = userLogin;
    this.modal.show();
  }

  displayUserLogin(): void {
    if (this.auth.requestLogin()) return;
    this.userLogin = true;
    this.failure = false;
  }

  displayAccessCode(): void {
    this.userLogin = false;
    this.failure = false;
  }

  submit() {
    this.failure = false;
    this.checking = true;
    if (this.userLogin) {
      this.loginUser();
    } else {
      this.loginGuest();
    }
  }

  close() {
    this.failure = false;
    this.checking = false;
    this.username = "";
    this.password = "";
    this.accessCode = "";
    this.modal.hide();
    this.loginWindow.closed();
  }

  private loginUser() {
    this.login.post(this.username, this.password).subscribe(
      (user) => this.loginSuccess(user),
      (err) => this.loginFailed(),
    );
  }

  private loginGuest() {
    this.login.get(this.accessCode).subscribe(
      (user) => {
        user.attributes.api_token = this.accessCode;
        this.loginSuccess(user);
      },
      (err) => this.loginFailed(),
    );
  }

  private loginSuccess(user: UserModel) {
    this.auth.setUser(user);
    this.close();
  }

  private loginFailed() {
    this.failure = true;
    this.checking = false;
  }
}
