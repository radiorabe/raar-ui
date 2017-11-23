import { CrudModel } from '../../../shared/models/crud.model';

export class PlaybackFormatModel extends CrudModel {
  attributes: {
    name: string;
    description: string | void;
    codec: string;
    bitrate: number;
    channels: number;
  } = {
    name: '',
    description: undefined,
    codec: '',
    bitrate: 1,
    channels: 2
  };

  toString(): string {
    return this.attributes.codec.toUpperCase() + ' ' + this.attributes.name;
  }
}
