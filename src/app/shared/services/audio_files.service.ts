import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {CrudService} from './crud.service';
import {BroadcastModel, CrudList, AudioFileModel} from '../models/index';
import {Observable} from "rxjs/Observable";

@Injectable()
export class AudioFilesService extends CrudService<AudioFileModel> {

  constructor(http: Http) {
    super(http, '/api/v1/audio_files')
  }

  getListForBroadcast(broadcast: BroadcastModel): Observable<CrudList<AudioFileModel>> {
    return this.http.get('/api/v1/broadcasts/' + broadcast.id + '/audio_files', this.options)
      .map(res => this.buildListFromResponse(res, this.buildEntity));
  }

  protected buildEntity(): AudioFileModel {
    return new AudioFileModel();
  }

}
