import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  moduleId: module.id,
  selector: 'sd-admin-nav',
  templateUrl: 'top-nav.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopNavComponent {

  constructor(public auth: AuthService, private router: Router) {}

  logout() {
    this.auth.logout();
    this.router.navigate(['login']);
  }

}
