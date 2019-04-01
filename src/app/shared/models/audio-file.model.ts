import { CrudModel } from "./crud.model";
import { BroadcastModel } from "./broadcast.model";

export class AudioFileModel extends CrudModel {
  attributes: {
    codec: string;
    bitrate: number;
    channels: number;
    playback_format: string;
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
