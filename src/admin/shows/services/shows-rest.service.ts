import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CrudRestService } from '../../shared/services/crud-rest.service';
import { ShowModel } from '../models/show.model';
import { AdminRemoteService } from '../../shared/services/admin-remote.service';

@Injectable()
export class ShowsRestService extends CrudRestService<ShowModel> {

  constructor(remote: AdminRemoteService) {
    super(remote, '/api/admin/shows');
  }

  merge(entity: ShowModel, targetId: number): Observable<ShowModel> {
    return this.remote.post(`${this.baseUrl}/${entity.id}/merge/${targetId}`, undefined)
      .catch(res => this.handleError(res))
      .map(res => this.updateEntityFromResponse(res, this.buildEntity()));
  }

  protected buildEntity(): ShowModel {
    return new ShowModel();
  }

}
