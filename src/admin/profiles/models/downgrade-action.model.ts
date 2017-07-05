import { CrudModel } from '../../../app/shared/models/crud.model';

export class DowngradeActionModel extends CrudModel {
  attributes: {
    months: number;
    bitrate: number | void;
    channels: number | void;
  } = {
    months: 12,
    bitrate: 1,
    channels: 2
  };

  ereasing: boolean = false;

  init() {
    this.ereasing = !this.attributes.bitrate;
  }
}
