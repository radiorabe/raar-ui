import { Injectable } from '@angular/core';
import { ReadRestService } from '../../../app/shared/services/read-rest.service';
import { AdminRemoteService } from '../../shared/services/admin-remote.service';
import { AudioEncodingModel } from '../models/audio-encoding.model';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AudioEncodingsService extends ReadRestService<AudioEncodingModel> {

  private entries$ = this.getList()
                      .map(list => list.entries)
                      .do(entries => entries.forEach(e => e.attributes.bitrates.sort((a,b) => b - a)))
                      .publishLast()
                      .refCount();

  constructor(remote: AdminRemoteService) {
    super(remote, '/api/admin/audio_encodings');
  }

  getEntries(): Observable<AudioEncodingModel[]> {
    return this.entries$;
  }

  protected buildEntity(): AudioEncodingModel {
    return new AudioEncodingModel();
  }

}
