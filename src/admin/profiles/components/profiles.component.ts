import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ProfilesService } from '../services/profiles.service';
import { ProfileModel } from '../models/profile.model';

@Component({
  moduleId: module.id,
  selector: 'sd-profiles',
  templateUrl: 'profiles.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfilesComponent {

  constructor(public profilesService: ProfilesService) {
    profilesService.reload();
  }

}
