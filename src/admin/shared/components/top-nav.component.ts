import { Component, Attribute, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '../../../app/shared/services/auth.service';

@Component({
  moduleId: module.id,
  selector: 'sd-admin-nav',
  templateUrl: 'top-nav.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopNavComponent {

  @Attribute('active') active: string;

  constructor(public auth: AuthService) {}

}
