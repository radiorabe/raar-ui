import { Component, ViewChild } from '@angular/core';
import { SmallModalComponent } from './small-modal.component';
import { LoginService } from '../services/login.service';
import { AuthService } from '../services/auth.service';

@Component({
  moduleId: module.id,
  selector: 'sd-login',
  templateUrl: 'login.html',
})
export class LoginComponent {

  @ViewChild('modal') public modal: SmallModalComponent;

  username: string;
  password: string;
  failure: boolean = false;

  constructor(private login: LoginService, private auth: AuthService) {}

  show() {
    this.modal.show();
  }

  submit() {
    this.login.post(this.username, this.password).subscribe(
      user => {
        this.auth.user = user;
        this.close();
      },
      err => {
        this.failure = true;
      }
    );
  }

  close() {
    this.failure = false;
    this.modal.hide();
  }

}
