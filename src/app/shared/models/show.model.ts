import { CrudModel } from './crud.model';

export class ShowModel extends CrudModel {
  public attributes: {
    name: string | void;
    details: string | void;
    audio_access: boolean;
  } = {
    name: undefined,
    details: undefined,
    audio_access: false
  };
}
