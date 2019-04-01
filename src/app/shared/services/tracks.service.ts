import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";
import { BroadcastModel, TrackModel, CrudList } from "../models/index";
import { ReadRestService } from "./read-rest.service";

@Injectable()
export class TracksService extends ReadRestService<TrackModel> {
  constructor(http: HttpClient) {
    super(http, "/api/tracks");
  }

  getListForBroadcast(
    broadcast: BroadcastModel
  ): Observable<CrudList<TrackModel>> {
    return this.getList({
      broadcast_id: broadcast.id,
      sort: "started_at",
      "page[size]": 500
    }).pipe(switchMap(list => this.loadAllEntries(list)));
  }

  protected buildEntity(): TrackModel {
    return new TrackModel();
  }

  private loadAllEntries(
    list: CrudList<TrackModel>
  ): Observable<CrudList<TrackModel>> {
    if (list.links.next) {
      return this.getNextEntries(list).pipe(
        switchMap(l => this.loadAllEntries(l))
      );
    } else {
      return of(list);
    }
  }
}
