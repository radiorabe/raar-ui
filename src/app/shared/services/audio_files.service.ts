import { Injectable } from '@angular/core';
import { ReadRestService } from './read-rest.service';
import { DateParamsService } from './date_params.service';
import { BroadcastModel, CrudList, AudioFileModel } from '../models/index';
import { Observable } from 'rxjs/Observable';
import { RemoteService } from './remote.service';

@Injectable()
export class AudioFilesService extends ReadRestService<AudioFileModel> {

  constructor(remote: RemoteService) {
    super(remote, '/api/audio_files');
  }

  getListForBroadcast(broadcast: BroadcastModel): Observable<CrudList<AudioFileModel>> {
    return this.remote.get('/api/broadcasts/' + broadcast.id + '/audio_files')
      .map(res => this.buildListFromResponse(res, this.buildEntity));
  }

  buildUrl(time: Date, playbackFormat: string, codec: string): string {
    return '/audio_files' +
           DateParamsService.convertTimeToPath(time) +
           '_' + playbackFormat +
           '.' + codec;
  }

  protected buildEntity(): AudioFileModel {
    return new AudioFileModel();
  }

}
