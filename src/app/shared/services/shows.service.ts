import { Injectable } from '@angular/core';
import { ReadRestService } from './read-rest.service';
import { ShowModel } from '../models/show.model';
import { RemoteService } from './remote.service';

@Injectable()
export class ShowsService extends ReadRestService<ShowModel> {

  constructor(remote: RemoteService) {
    super(remote, '/api/shows');
  }

  protected buildEntity(): ShowModel {
    return new ShowModel();
  }
}
