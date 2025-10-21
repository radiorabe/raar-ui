import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { switchMap, map } from "rxjs/operators";
import { BroadcastModel, TrackModel, CrudList } from "../models/index";
import { ReadRestService } from "./read-rest.service";
import { DateParamsService } from "./date-params.service";

@Injectable()
export class TracksService extends ReadRestService<TrackModel> {
  constructor() {
    super("/api/tracks");
  }

  getListForBroadcast(
    broadcast: BroadcastModel,
  ): Observable<CrudList<TrackModel>> {
    return this.getList({
      broadcast_id: broadcast.id,
      sort: "started_at",
      "page[size]": 500,
    }).pipe(switchMap((list) => this.loadAllEntries(list)));
  }

  getListForHour(hour: Date): Observable<TrackModel[]> {
    return this.http
      .get(
        this.baseUrl + this.convertHourToPath(hour),
        this.requestOptionsFromParams({
          sort: "started_at",
          "page[size]": 100,
        }),
      )
      .pipe(map((json) => this.buildTracksInHourFromResponse(json, hour)));
  }

  protected buildEntity(): TrackModel {
    return new TrackModel();
  }

  private loadAllEntries(
    list: CrudList<TrackModel>,
  ): Observable<CrudList<TrackModel>> {
    if (list.links.next) {
      return this.getNextEntries(list).pipe(
        switchMap((l) => this.loadAllEntries(l)),
      );
    } else {
      return of(list);
    }
  }

  private convertHourToPath(date: Date): string {
    return (
      DateParamsService.convertDateToPath(date) +
      "/" +
      DateParamsService.zeroPad(date.getHours())
    );
  }

  private buildTracksInHourFromResponse(json: any, hour: Date): TrackModel[] {
    return (
      json["data"]
        .map((item: any) => this.copyAttributes(item, this.buildEntity()))
        // API returns all tracks overlapping the requested hour.
        // Filter the ones that actually did start in the requested hour.
        .filter(
          (e: TrackModel) =>
            e.attributes.started_at.getHours() === hour.getHours(),
        )
    );
  }
}
