import { CrudModel } from './crud.model';

export class ShowModel extends CrudModel {
  attributes: {
    name: string;
    details: string | void;
  } = {
    name: '',
    details: undefined
  };
}
