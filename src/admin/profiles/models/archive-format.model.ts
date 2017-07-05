import { CrudModel } from '../../../app/shared/models/crud.model';

export class ArchiveFormatModel extends CrudModel {
  attributes: {
    codec: string;
    initial_bitrate: number;
    initial_channels: number;
    max_public_bitrate: number;
  } = {
    codec: '',
    initial_bitrate: 1,
    initial_channels: 2,
    max_public_bitrate: 0
  };

  toString(): string {
    return this.attributes.codec.toUpperCase();
  }
}
