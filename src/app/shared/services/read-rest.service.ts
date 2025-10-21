import { CrudModel } from "../models/crud.model";
import { CrudList } from "../models/crud-list";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import { inject } from "@angular/core";

export class ReadRestService<T extends CrudModel> {
  protected http = inject(HttpClient);

  constructor(public baseUrlTemplate: string) {}

  getList(params?: any): Observable<CrudList<T>> {
    return this.http
      .get(this.baseUrl, this.requestOptionsFromParams(params))
      .pipe(map((json) => this.buildListFromResponse(json, this.buildEntity)));
  }

  getNextEntries(list: CrudList<T>): Observable<CrudList<T>> {
    if (list.links.next === undefined || list.links.next === null) {
      return new BehaviorSubject<CrudList<T>>(list);
    }

    return this.http.get(list.links.next).pipe(
      map((json) => this.buildListFromResponse(json, this.buildEntity)),
      map((res) => {
        res.links.prev = list.links.prev;
        res.entries = list.entries.concat(res.entries);
        res.included = list.included.concat(res.included);
        return res;
      }),
    );
  }

  // load a new entity by id or reload an existing one
  get(entityOrId: number | T): Observable<T> {
    let id: number;
    let entity: T;
    if (typeof entityOrId === "number") {
      id = entityOrId;
      entity = this.buildEntity();
    } else {
      id = entityOrId.id;
      entity = entityOrId;
    }
    return this.http
      .get(`${this.baseUrl}/${id}`)
      .pipe(map((json) => this.updateEntityFromResponse(json, entity)));
  }

  protected get baseUrl(): string {
    return this.baseUrlTemplate;
  }

  protected buildListFromResponse<R extends CrudModel>(
    json: any,
    builder: () => R,
  ): CrudList<R> {
    let list = new CrudList<R>();
    list.entries = json["data"].map((item: any) =>
      this.copyAttributes(item, builder()),
    );
    Object.assign(list.links, json["links"]);

    return list;
  }

  protected updateEntityFromResponse<R extends CrudModel>(
    json: any,
    entity: R,
  ): R {
    return this.copyAttributes(json["data"], entity);
  }

  protected copyAttributes<R extends CrudModel>(source: any, dest: R): R {
    Object.assign(dest, source);
    dest.init();
    return dest;
  }

  protected buildEntity(): T {
    throw new Error(
      `${this.constructor.name}#buildEntity() is not implemented`,
    );
  }

  protected requestOptionsFromParams(params?: any): { params?: HttpParams } {
    if (!params) return {};
    return {
      params: Object.keys(params)
        .filter(this.paramFilter(params))
        .reduce((s, key) => s.append(key, params[key]), new HttpParams()),
    };
  }

  private paramFilter(params: any): (key: string) => boolean {
    return (key) =>
      params[key] != null &&
      ((typeof params[key] !== "string" && !Array.isArray(params[key])) ||
        params[key].length !== 0);
  }
}
