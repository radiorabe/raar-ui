import { CrudModel } from '../../shared/models/crud.model';

export class AudioEncodingModel extends CrudModel {
  attributes: {
    codec: string;
    file_extension: string;
    mime_type: string;
    bitrates: number[];
    channels: number[];
  } = {
    codec: '',
    file_extension: '',
    mime_type: '',
    bitrates: [],
    channels: []
  };

  toString(): string {
    return this.attributes.codec.toUpperCase();
  }
}
