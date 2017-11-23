import { CrudModel } from './crud.model';
import { BroadcastModel } from './broadcast.model';

export class AudioFileModel extends CrudModel {
  attributes: {
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

  relationships: {
    broadcast?: BroadcastModel;
  } = {};

  links: {
    self: string | void;
    play: string | void;
    download?: string;
  } = {
    self: undefined,
    play: undefined
  };
}
