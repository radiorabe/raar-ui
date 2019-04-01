import { Injectable } from "@angular/core";
import { ReadRestService } from "./read-rest.service";
import { DateParamsService } from "./date-params.service";
import { BroadcastModel, CrudList, AudioFileModel } from "../models/index";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

@Injectable()
export class AudioFilesService extends ReadRestService<AudioFileModel> {
  constructor(http: HttpClient) {
    super(http, "/api/audio_files");
  }

  getListForBroadcast(
    broadcast: BroadcastModel
  ): Observable<CrudList<AudioFileModel>> {
    return this.http
      .get("/api/broadcasts/" + broadcast.id + "/audio_files")
      .pipe(
        map(json => {
          const list = this.buildListFromResponse(json, this.buildEntity);
          for (const a of list.entries) a.relationships.broadcast = broadcast;
          return list;
        })
      );
  }

  buildUrl(time: Date, playbackFormat: string, codec: string): string {
    return (
      "/audio_files" +
      DateParamsService.convertTimeToPath(time) +
      "_" +
      playbackFormat +
      "." +
      codec
    );
  }

  protected buildEntity(): AudioFileModel {
    return new AudioFileModel();
  }
}
