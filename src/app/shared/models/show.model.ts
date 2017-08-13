import { CrudModel } from './crud.model';

export class ShowModel extends CrudModel {
  public attributes: {
    name: string;
    details: string | void;
    audio_access: boolean;
  } = {
    name: '',
    details: undefined,
    audio_access: false
  };
}
