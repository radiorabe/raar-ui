import { CrudModel } from '../../shared/models/crud.model';

export class ShowModel extends CrudModel {
  attributes: {
    name: string;
    details: string | void;
  } = {
    name: '',
    details: undefined
  };

  toString(): string {
    return this.attributes.name;
  }
}
