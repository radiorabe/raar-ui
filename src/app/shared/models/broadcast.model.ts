import {CrudModel} from './crud.model';
import {AudioFileModel} from './audio_file.model';

export class BroadcastModel extends CrudModel {
  public attributes: {
    label: string;
    details: string;
    started_at: Date;
    finished_at: Date;
  };

  public relationships: {
    audio_files?: AudioFileModel[];
  } = {};

  init() {
    this.convertToDate('started_at');
    this.convertToDate('finished_at');
  }

  private convertToDate(key: string) {
    if (typeof this.attributes[key] == "string") {
      this.attributes[key] = new Date(this.attributes[key]);
    }
  }
}
