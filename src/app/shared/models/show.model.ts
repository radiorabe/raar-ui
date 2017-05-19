import { CrudModel } from './crud.model';

export class ShowModel extends CrudModel {
  public attributes: {
    name: string;
    details: string | void;
  } = {
    name: '',
    details: undefined
  };
}
