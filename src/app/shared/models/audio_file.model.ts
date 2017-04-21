import { CrudModel } from './crud.model';
import { BroadcastModel } from './broadcast.model';

export class AudioFileModel extends CrudModel {
  public attributes: {
    codec: string | void;
    bitrate: number | void;
    channels: number | void;
    playback_format: string | void;
  } = {
    codec: undefined,
    bitrate: undefined,
    channels: undefined,
    playback_format: undefined
  };

  public relationships: {
    broadcast?: BroadcastModel;
  } = {};

  public links: {
    self: string | void;
    play: string | void;
    download?: string;
  } = {
    self: undefined,
    play: undefined
  };
}
