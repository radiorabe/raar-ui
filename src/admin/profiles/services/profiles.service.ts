import { Injectable } from '@angular/core';
import { CrudService } from '../../shared/services/crud.service';
import { ProfileModel } from '../models/profile.model';
import { AdminRemoteService } from '../../shared/services/admin-remote.service';

@Injectable()
export class ProfilesService extends CrudService<ProfileModel> {

  constructor(remote: AdminRemoteService) {
    super(remote, '/api/admin/profiles');
  }

  protected buildEntity(): ProfileModel {
    return new ProfileModel();
  }

}
