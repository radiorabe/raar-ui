import { Injectable } from '@angular/core';
import { ModelsService } from '../../shared/services/models.service';
import { PlaybackFormatModel } from '../models/playback-format.model';
import { PlaybackFormatsRestService } from './playback-formats-rest.service';

@Injectable()
export class PlaybackFormatsService extends ModelsService<PlaybackFormatModel> {

  protected sortAttr = 'codec';

  constructor(rest: PlaybackFormatsRestService) {
    super(rest);
  }

}
