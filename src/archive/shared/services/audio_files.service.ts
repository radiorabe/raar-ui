import { Injectable } from '@angular/core';
import { ReadRestService } from '../../../shared/services/read-rest.service';
import { DateParamsService } from '../../../shared/services/date_params.service';
import { BroadcastModel, CrudList, AudioFileModel } from '../../../shared/models/index';
import { Observable } from 'rxjs/Observable';
import { RemoteService } from '../../../shared/services/remote.service';

@Injectable()
export class AudioFilesService extends ReadRestService<AudioFileModel> {

  constructor(remote: RemoteService) {
    super(remote, '/api/audio_files');
  }

  getListForBroadcast(broadcast: BroadcastModel): Observable<CrudList<AudioFileModel>> {
    return this.remote.get('/api/broadcasts/' + broadcast.id + '/audio_files')
      .map(res => {
        const list = this.buildListFromResponse(res, this.buildEntity);
        for (const a of list.entries) a.relationships.broadcast = broadcast;
        return list;
      });
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
