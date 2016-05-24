import {CrudModel} from './crud.model';
import {BroadcastModel} from './broadcast.model';

export class AudioFileModel extends CrudModel {
  public attributes: {
    codec: string;
    bitrate: number;
    channels: number;
    playback_format: string;
    url: string;
  };

  public relationships: {
    broadcast?: BroadcastModel;
  } = {};
}
