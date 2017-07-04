import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '../../../app/shared/services/auth.service';

@Component({
  moduleId: module.id,
  selector: 'sd-admin-nav',
  templateUrl: 'top-nav.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopNavComponent {

  constructor(public auth: AuthService) {}

}
