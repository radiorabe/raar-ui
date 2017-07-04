import { RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CrudModel } from '../models/crud.model';
import { CrudList } from '../models/crud_list';
import { RemoteService } from './remote.service';
import 'rxjs/add/operator/map';

export class ReadRestService<T extends CrudModel> {

  constructor(protected remote: RemoteService, public baseUrlTemplate: string) {}

  getList(params?: any): Observable<CrudList<T>> {
    return this.remote.get(this.baseUrl, this.buildUrlOptions(params))
      .catch(res => this.handleError(res))
      .map(res => this.buildListFromResponse(res, this.buildEntity));
  }

  getNextEntries(list: CrudList<T>): Observable<CrudList<T>> {
    if (list.links.next === undefined) return new BehaviorSubject<CrudList<T>>(list);

    return this.remote.get(list.links.next)
      .catch(res => this.handleError(res))
      .map(res => this.buildListFromResponse(res, this.buildEntity))
      .map(res => {
        res.links.prev = list.links.prev;
        res.entries = list.entries.concat(res.entries);
        res.included = list.included.concat(res.included);
        return res;
      });
  }

  // load a new entity by id or reload an existing one
  get(entityOrId: number | T): Observable<T> {
    let id: number;
    let entity: T;
    if (typeof entityOrId === 'number') {
      id = entityOrId;
      entity = this.buildEntity();
    } else {
      id = entityOrId.id;
      entity = entityOrId;
    }
    return this.remote.get(`${this.baseUrl}/${id}`)
      .catch(res => this.handleError(res))
      .map(res => this.updateEntityFromResponse(res, entity));
  }

  protected get baseUrl(): string {
    return this.baseUrlTemplate;
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

  protected handleError(res: Response): Observable<Response> {
    let json: any = {};
    try {
      json = res.json();
    } catch (e) {
      console.error(e);
    }
    const message = json.error || json.errors || res.status;
    return Observable.throw(message);
  }

}
