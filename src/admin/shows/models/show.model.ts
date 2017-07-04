import { CrudModel } from '../../shared/models/crud.model';

export class ShowModel extends CrudModel {
  attributes: {
    name: string;
    details: string | void;
  } = {
    name: '',
    details: undefined
  };
  relationships: {
    profile: {
      data: {
        id: number;
        type: 'profiles'
      }
    } | void
  } = {
    profile: undefined
  }

  toString(): string {
    return this.attributes.name;
  }
}
