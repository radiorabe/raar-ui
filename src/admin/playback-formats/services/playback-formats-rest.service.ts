import { Injectable } from '@angular/core';
import { CrudRestService } from '../../shared/services/crud-rest.service';
import { AdminRemoteService } from '../../shared/services/admin-remote.service';
import { PlaybackFormatModel } from '../models/playback-format.model';

@Injectable()
export class PlaybackFormatsRestService extends CrudRestService<PlaybackFormatModel> {

  constructor(remote: AdminRemoteService) {
    super(remote, '/api/admin/playback_formats');
  }

  protected buildEntity(): PlaybackFormatModel {
    return new PlaybackFormatModel();
  }

}
