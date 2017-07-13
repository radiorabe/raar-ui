import { CrudModel } from '../../../app/shared/models/crud.model';

export class ArchiveFormatModel extends CrudModel {
  attributes: {
    codec: string;
    initial_bitrate: number;
    initial_channels: number;
    max_public_bitrate: number | null;
    max_logged_in_bitrate: number | null;
    max_priviledged_bitrate: number | null;
    priviledged_groups: string[];
    download_permission: string;
  } = {
    codec: '',
    initial_bitrate: 1,
    initial_channels: 2,
    max_public_bitrate: 0,
    max_logged_in_bitrate: 0,
    max_priviledged_bitrate: 0,
    priviledged_groups: [],
    download_permission: 'admin'
  };

  toString(): string {
    return this.attributes.codec.toUpperCase();
  }
}
