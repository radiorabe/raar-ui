import { Injectable } from '@angular/core';
import { CrudRestService } from '../../shared/services/crud-rest.service';
import { AdminRemoteService } from '../../shared/services/admin-remote.service';
import { AccessCodeModel } from '../models/access-code.model';

@Injectable()
export class AccessCodesRestService extends CrudRestService<AccessCodeModel> {

  constructor(remote: AdminRemoteService) {
    super(remote, '/api/admin/access_codes');
  }

  protected buildEntity(): AccessCodeModel {
    return new AccessCodeModel();
  }

}
