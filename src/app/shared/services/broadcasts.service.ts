import { Injectable, inject } from "@angular/core";
import { ReadRestService } from "./read-rest.service";
import { DateParamsService } from "./date-params.service";
import { BroadcastModel, ShowModel, CrudList } from "../models/index";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

@Injectable()
export class BroadcastsService extends ReadRestService<BroadcastModel> {
  constructor() {
    super("/api/broadcasts");
  }

  getListForShow(show: ShowModel): Observable<CrudList<BroadcastModel>> {
    return this.getList({ show_id: show.id, sort: "-started_at" });
  }

  getListForDate(date: Date): Observable<CrudList<BroadcastModel>> {
    return this.http
      .get(this.baseUrl + DateParamsService.convertDateToPath(date))
      .pipe(map((json) => this.buildListFromResponse(json, this.buildEntity)));
  }

  getListForQuery(query: string): Observable<CrudList<BroadcastModel>> {
    return this.getList({ q: query, sort: "-started_at" });
  }

  getForTime(date: Date): Observable<BroadcastModel | void> {
    return this.http
      .get(this.baseUrl + DateParamsService.convertTimeToPath(date))
      .pipe(map((json) => this.buildBroadcastFromResponse(json)));
  }

  update(
    entity: BroadcastModel,
    entityToUpdate: BroadcastModel = entity,
  ): Observable<BroadcastModel> {
    return this.http
      .patch(`${this.baseUrl}/${entity.id}`, this.rootedJson(entity))
      .pipe(map((json) => this.updateEntityFromResponse(json, entityToUpdate)));
  }

  protected buildEntity(): BroadcastModel {
    return new BroadcastModel();
  }

  private buildBroadcastFromResponse(json: any): BroadcastModel | void {
    const data = json["data"];
    if (data.length === 0) {
      return undefined;
    } else {
      return this.copyAttributes(data[0], this.buildEntity());
    }
  }

  private rootedJson(entity: BroadcastModel): string {
    let data: any = {};
    data["data"] = entity;
    return JSON.stringify(data);
  }
}
