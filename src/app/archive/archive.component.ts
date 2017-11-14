import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { LoginWindowService } from '../shared/services/login-window.service';

@Component({
  moduleId: module.id,
  selector: 'sd-archive',
  templateUrl: 'archive.html',
})
export class ArchiveComponent {

  constructor(public auth: AuthService,
              private loginWindow: LoginWindowService) {
    auth.isLoggedIn.subscribe();
  }

  showLogin() {
    this.loginWindow.show();
  }

}
