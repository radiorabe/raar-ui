import { LoginService } from '../../../shared/services/index';
import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserModel } from '../../../shared/models/index';
import { AdminAuthService } from '../../shared/services/admin-auth.service';

@Component({
  moduleId: module.id,
  selector: 'sd-login-page',
  templateUrl: 'login-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {

  username: string;
  password: string;
  checking: boolean = false;
  failure: boolean = false;

  constructor(private login: LoginService,
              private auth: AdminAuthService,
              private cd: ChangeDetectorRef) {
  }

  submit() {
    this.failure = false;
    this.checking = true;
    this.loginUser();
  }

  private loginUser() {
    this.login.post(this.username, this.password).subscribe(
      user => this.loginSuccess(user),
      err => this.loginFailed()
    );
  }

  private loginSuccess(user: UserModel) {
    this.auth.redirectUrl = '/';
    this.auth.setUser(user);
  }

  private loginFailed() {
    this.failure = true;
    this.checking = false;
    this.cd.markForCheck();
  }

}
