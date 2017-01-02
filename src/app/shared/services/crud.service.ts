import {Http, Headers, RequestOptions, Response, URLSearchParams} from '@angular/http';
import {Observable} from "rxjs/Observable";
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {CrudModel} from '../models/crud.model';
import {CrudList} from '../models/crud_list';
import 'rxjs/add/operator/map';

export class CrudService<T extends CrudModel> {

  protected headers = new Headers({'Content-Type': 'application/vnd.api+json'});
  protected options = new RequestOptions({headers: this.headers});

  constructor(protected http: Http, public baseUrl: string) {}

  getList(params?: any): Observable<CrudList<T>> {
    return this.http.get(this.baseUrl, this.buildUrlOptions(params))
      .map(res => this.buildListFromResponse(res, this.buildEntity))
      .catch(this.handleHttpError.bind(this));
  }

  getNextEntries(list: CrudList<T>): Observable<CrudList<T>> {
    if (list.links.next === undefined) return new BehaviorSubject<CrudList<T>>(list);

    return this.http.get(list.links.next, this.options)
      .map(res => this.buildListFromResponse(res, this.buildEntity))
      .map(res => {
        res.links.prev = list.links.prev;
        res.entries = list.entries.concat(res.entries);
        res.included = list.included.concat(res.included);
        return res;
      })
      .catch(this.handleHttpError.bind(this));
  }

  // load a new entity by id or reload an existing one
  get(id: number): Observable<T>;
  get(entity: T): Observable<T>;
  get(entity: any): Observable<T> {
    let id: number;
    if (typeof entity == "number") {
      id = entity;
      entity = this.buildEntity();
    } else {
      id = entity.id;
    }
    return this.http.get(`${this.baseUrl}/${id}`, this.options)
      .map(res => this.updateEntityFromResponse(res, entity))
      .catch(this.handleHttpError.bind(this));
  }

  create(entity: T, entityToUpdate?: T): Observable<T> {
    if (entityToUpdate === undefined) entityToUpdate = entity;
    return this.http.post(this.baseUrl, this.rootedJson(entity), this.options)
      .map(res => this.updateEntityFromResponse(res, entityToUpdate))
      .catch(this.handleHttpError.bind(this));
  }

  update(entity: T, entityToUpdate?: T): Observable<T> {
    if (entityToUpdate === undefined) entityToUpdate = entity;
    return this.http.patch(`${this.baseUrl}/${entity.id}`, this.rootedJson(entity), this.options)
      .map(res => this.updateEntityFromResponse(res, entityToUpdate))
      .catch(this.handleHttpError.bind(this));
  }

  remove(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`, this.options)
      .map(res => res)
      .catch(this.handleHttpError.bind(this));
  }

  protected rootedJson(entity: T): string {
    let data: any = {};
    data['data'] = entity;
    return JSON.stringify(data)
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
    dest.init()
    return dest;
  }

  protected buildEntity(): T { return null; }

  protected handleHttpError(res: Response): Observable<string> {
    let json: any = {};
    try { json = res.json(); } catch (e) { }
    const message = json.error || json.errors || res.status;
    return Observable.throw(message);
  }

  private buildUrlOptions(params?: any): RequestOptions {
    const search = new URLSearchParams();
    for (const k in params) search.append(k, params[k]);
    return new RequestOptions({ search: search, headers: this.headers });
  }

}
