import { RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CrudModel } from '../models/crud.model';
import { CrudList } from '../../../app/shared/models/crud_list';
import { RemoteService } from '../../../app/shared/services/remote.service';
import 'rxjs/add/operator/map';

export class CrudService<T extends CrudModel> {

  constructor(protected remote: RemoteService, public baseUrl: string) {}

  getList(params?: any): Observable<CrudList<T>> {
    return this.remote.get(this.baseUrl, this.buildUrlOptions(params))
      .map(res => this.buildListFromResponse(res, this.buildEntity));
  }

  getNextEntries(list: CrudList<T>): Observable<CrudList<T>> {
    if (list.links.next === undefined) return new BehaviorSubject<CrudList<T>>(list);

    return this.remote.get(list.links.next)
      .map(res => this.buildListFromResponse(res, this.buildEntity))
      .map(res => {
        res.links.prev = list.links.prev;
        res.entries = list.entries.concat(res.entries);
        res.included = list.included.concat(res.included);
        return res;
      });
  }

  // load a new entity by id or reload an existing one
  get(entity: T | number): Observable<T> {
    let id: number;
    if (typeof entity === 'number') {
      id = entity;
      entity = this.buildEntity();
    } else {
      id = entity.id;
    }
    return this.remote.get(`${this.baseUrl}/${id}`)
      .map(res => this.updateEntityFromResponse(res, entity));
  }

  create(entity: T, entityToUpdate: T = entity): Observable<T> {
    return this.remote.post(this.baseUrl, this.rootedJson(entity))
      .map(res => this.updateEntityFromResponse(res, entityToUpdate));
  }

  update(entity: T, entityToUpdate: T = entity): Observable<T> {
    return this.remote.patch(`${this.baseUrl}/${entity.id}`, this.rootedJson(entity))
      .map(res => this.updateEntityFromResponse(res, entityToUpdate));
  }

  remove(id: number) {
    return this.remote.delete(`${this.baseUrl}/${id}`)
      .map(res => res);
  }

  protected rootedJson(entity: T): string {
    let data: any = {};
    data['data'] = entity;
    return JSON.stringify(data);
  }

  protected buildListFromResponse<R extends CrudModel>(res: Response, builder: () => R): CrudList<R> {
    const json = res.json();
    let list = new CrudList<R>();
    list.entries = json['data'].map((item: any) => this.copyAttributes(item, builder()));
    Object.assign(list.links, json['links']);

    return list;
  }

  protected updateEntityFromResponse<R extends CrudModel>(res: Response, entity: R): R {
    return this.copyAttributes(res.json()['data'], entity);
  }

  protected copyAttributes<R extends CrudModel>(source: any, dest: R): R {
    Object.assign(dest, source);
    dest.init();
    return dest;
  }

  protected buildEntity(): T {
    throw new Error(`${this.constructor.name}#buildEntity() is not implemented`);
  }

  private buildUrlOptions(params?: any): RequestOptions {
    const search = new URLSearchParams();
    for (const k in params) search.append(k, params[k]);
    return new RequestOptions({ search: search });
  }

}
