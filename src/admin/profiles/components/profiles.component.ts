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

  public profiles: Observable<ProfileModel[]>;

  constructor(private profileService: ProfilesService) {
    this.profiles = this.fetchProfiles();
  }

  private fetchProfiles(): Observable<ProfileModel[]> {
    return this.profileService
      .getList({ sort: 'name', 'page[size]': 500 })
      .map(list => list.entries)
      .catch(_ => Observable.of([]));
  }

}
