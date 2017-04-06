import { CrudModel } from './crud.model';

export class ShowModel extends CrudModel {
  public attributes: {
    name: string | void;
    details: string | void;
  } = {
    name: undefined,
    details: undefined
  };
}
