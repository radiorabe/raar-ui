import { Injectable } from '@angular/core';
import { ModelsService } from '../../shared/services/models.service';
import { ProfileModel } from '../models/profile.model';
import { ProfilesRestService } from './profiles-rest.service';

@Injectable()
export class ProfilesService extends ModelsService<ProfileModel> {

  protected sortAttr = 'name';

  constructor(rest: ProfilesRestService) {
    super(rest);
  }

  getDefaultEntry(): ProfileModel | undefined {
    return this.entries.find(e => e.attributes.default);
  }

}
