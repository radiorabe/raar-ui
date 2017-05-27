import { Injectable } from '@angular/core';
import { CrudService } from '../../shared/services/crud.service';
import { ShowModel } from '../models/show.model';
import { RemoteService } from '../../../app/shared/services/remote.service';

@Injectable()
export class ShowsService extends CrudService<ShowModel> {

  constructor(remote: RemoteService) {
    super(remote, '/api/admin/shows');
  }

  protected buildEntity(): ShowModel {
    return new ShowModel();
  }
}
