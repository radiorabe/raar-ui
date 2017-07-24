import { Component, ViewChild } from '@angular/core';
import { SmallModalComponent } from './small-modal.component';
import { LoginService } from '../services/login.service';
import { AuthService } from '../services/auth.service';
import { LoginWindowService } from '../services/login-window.service';
import { UserModel } from '../models/user.model';

@Component({
  moduleId: module.id,
  selector: 'sd-login',
  templateUrl: 'login.html',
})
export class LoginComponent {

  @ViewChild('modal') public modal: SmallModalComponent;

  username: string;
  password: string;
  accessCode: string;
  checking: boolean = false;
  failure: boolean = false;
  userLogin: boolean = true;

  constructor(private login: LoginService,
              private auth: AuthService,
              private loginWindow: LoginWindowService) {
    this.loginWindow.show$.subscribe(this.show.bind(this));
  }

  show() {
    this.modal.show();
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
    this.username = '';
    this.password = '';
    this.accessCode = '';
    this.modal.hide();
    this.loginWindow.closed();
  }

  private loginUser() {
    this.login.post(this.username, this.password).subscribe(
      user => this.loginSuccess(user),
      err => this.loginFailed()
    );
  }

  private loginGuest() {
    this.login.get(this.accessCode).subscribe(
      user => {
        user.attributes.api_token = this.accessCode;
        this.loginSuccess(user);
      },
      err => this.loginFailed()
    );
  }

  private loginSuccess(user: UserModel) {
    this.auth.user = user;
    this.close();
  }

  private loginFailed() {
    this.failure = true;
    this.checking = false;
  }

}
