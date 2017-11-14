import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '../../../app/shared/services/auth.service';
import { LoginWindowService } from '../../../app/shared/services/index';

@Component({
  moduleId: module.id,
  selector: 'sd-admin-nav',
  templateUrl: 'top-nav.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopNavComponent {

  constructor(public auth: AuthService, private loginWindow: LoginWindowService) {
    auth.isAdminLoggedIn.subscribe();
  }

  showLogin() {
    this.loginWindow.show();
  }

}
