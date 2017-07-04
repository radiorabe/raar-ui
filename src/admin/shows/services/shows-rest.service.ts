import { Injectable } from '@angular/core';
import { CrudRestService } from '../../shared/services/crud-rest.service';
import { ShowModel } from '../models/show.model';
import { AdminRemoteService } from '../../shared/services/admin-remote.service';

@Injectable()
export class ShowsRestService extends CrudRestService<ShowModel> {

  constructor(remote: AdminRemoteService) {
    super(remote, '/api/admin/shows');
  }

  protected buildEntity(): ShowModel {
    return new ShowModel();
  }

}
