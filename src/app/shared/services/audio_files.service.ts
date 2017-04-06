import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { CrudService } from './crud.service';
import { DateParamsService } from './date_params.service';
import { BroadcastModel, CrudList, AudioFileModel } from '../models/index';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AudioFilesService extends CrudService<AudioFileModel> {

  constructor(http: Http) {
    super(http, '/api/audio_files');
  }

  getListForBroadcast(broadcast: BroadcastModel): Observable<CrudList<AudioFileModel>> {
    return this.http.get('/api/broadcasts/' + broadcast.id + '/audio_files', this.options)
      .map(res => this.buildListFromResponse(res, this.buildEntity));
  }

  buildUrl(time: Date, playbackFormat: string, codec: string): string {
    return this.baseUrl +
           DateParamsService.convertTimeToPath(time) +
           '_' + playbackFormat +
           '.' + codec;
  }

  protected buildEntity(): AudioFileModel {
    return new AudioFileModel();
  }

}
