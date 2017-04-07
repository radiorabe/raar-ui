import { CrudModel } from './crud.model';
import { BroadcastModel } from './broadcast.model';

export class AudioFileModel extends CrudModel {
  public attributes: {
    codec: string | void;
    bitrate: number | void;
    channels: number | void;
    playback_format: string | void;
    url: string | void;
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
