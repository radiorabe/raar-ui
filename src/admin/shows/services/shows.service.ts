import { Injectable } from '@angular/core';
import { CrudService } from '../../shared/services/crud.service';
import { ShowModel } from '../models/show.model';
import { AdminRemoteService } from '../../shared/services/admin-remote.service';

@Injectable()
export class ShowsService extends CrudService<ShowModel> {

  constructor(remote: AdminRemoteService) {
    super(remote, '/api/admin/shows');
  }

  protected buildEntity(): ShowModel {
    return new ShowModel();
  }

}
