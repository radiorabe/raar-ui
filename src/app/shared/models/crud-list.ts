import { CrudModel } from "./crud.model";

export class CrudList<T extends CrudModel> {
  entries: T[] = [];
  included: any[] = [];
  links: {
    self?: string;
    next?: string;
    prev?: string;
    first?: string;
    last?: string;
  } = {};
}
