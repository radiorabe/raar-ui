import { RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CrudModel } from '../../../shared/models/crud.model';
import { CrudList } from '../../../shared/models/crud_list';
import { ReadRestService } from '../../../shared/services/read-rest.service';
import { AdminRemoteService } from './admin-remote.service';
import 'rxjs/add/operator/map';


export class CrudRestService<T extends CrudModel> extends ReadRestService<T> {

  constructor(protected remote: AdminRemoteService, baseUrlTemplate: string) {
    super(remote, baseUrlTemplate);
  }

  create(entity: T, entityToUpdate: T = entity): Observable<T> {
    return this.remote.post(this.baseUrl, this.rootedJson(entity))
      .catch(res => this.handleError(res))
      .map(res => this.updateEntityFromResponse(res, entityToUpdate));
  }

  update(entity: T, entityToUpdate: T = entity): Observable<T> {
    return this.remote.patch(`${this.baseUrl}/${entity.id}`, this.rootedJson(entity))
      .catch(res => this.handleError(res))
      .map(res => this.updateEntityFromResponse(res, entityToUpdate));
  }

  remove(id: number): Observable<void> {
    return this.remote.delete(`${this.baseUrl}/${id}`)
      .catch(res => this.handleError(res))
      .map(res => undefined);
  }

  protected rootedJson(entity: T): string {
    let data: any = {};
    data['data'] = entity;
    return JSON.stringify(data);
  }

  protected handleError(res: Response): Observable<Response> {
    return Observable.throw(res);
  }

}
