import { CrudModel } from './crud.model';
import { BroadcastModel } from './broadcast.model';

export class AudioFileModel extends CrudModel {
  public attributes: {
    codec: string;
    bitrate: number;
    channels: number;
    playback_format: string;
    url: string;
  } = {
    codec: undefined,
    bitrate: undefined,
    channels: undefined,
    playback_format: undefined,
    url: undefined,
  };

  public relationships: {
    broadcast?: BroadcastModel;
  } = {};
}
