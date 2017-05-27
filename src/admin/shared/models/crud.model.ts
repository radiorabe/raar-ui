export class CrudModel {
  id: number;
  type: string;
  attributes: any;
  links: {
    self: string;
  }

  init() {} // tslint:disable-line
}
