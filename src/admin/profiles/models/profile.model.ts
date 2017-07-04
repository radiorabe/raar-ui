import { CrudModel } from '../../shared/models/crud.model';

export class ProfileModel extends CrudModel {
  attributes: {
    name: string;
    description: string | void;
    default: boolean;
  } = {
    name: '',
    description: undefined,
    default: false
  };

  toString(): string {
    return this.attributes.name;
  }
}
