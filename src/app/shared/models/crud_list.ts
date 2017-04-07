import { CrudModel } from './crud.model';

export class CrudList<T extends CrudModel> {
  public entries: T[] = [];
  public included: any[] = [];
  public links: {
    self?: string;
    next?: string;
    prev?: string;
    first?: string;
    last?: string;
  } = {};
}
