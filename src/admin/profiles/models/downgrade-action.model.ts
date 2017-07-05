import { CrudModel } from '../../shared/models/crud.model';

export class DowngradeActionModel extends CrudModel {
  attributes: {
    months: number;
    bitrate: number | void;
    channels: number | void;
  } = {
    months: 12,
    bitrate: undefined,
    channels: undefined,
  };

  ereasing: boolean = false;

  init() {
    this.ereasing = !this.attributes.bitrate;
  }
}
