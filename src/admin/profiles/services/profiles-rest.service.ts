import { Injectable } from '@angular/core';
import { CrudRestService } from '../../shared/services/crud-rest.service';
import { ProfileModel } from '../models/profile.model';
import { AdminRemoteService } from '../../shared/services/admin-remote.service';

@Injectable()
export class ProfilesRestService extends CrudRestService<ProfileModel> {

  constructor(remote: AdminRemoteService) {
    super(remote, '/api/admin/profiles');
  }

  protected buildEntity(): ProfileModel {
    return new ProfileModel();
  }

}
