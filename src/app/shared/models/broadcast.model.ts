import { CrudModel } from './crud.model';
import { AudioFileModel } from './audio_file.model';

export class BroadcastModel extends CrudModel {
  public attributes: {
    label: string;
    details: string;
    people: string;
    started_at: Date;
    finished_at: Date;
    show_id: number;
    audio_access: boolean;
  };

  public relationships: {
    audio_files?: AudioFileModel[];
    show?: {
      data: {
        id: number;
        type: string;
      }
    }
  } = {};

  init() {
    this.convertToDate('started_at');
    this.convertToDate('finished_at');
  }

  isCovering(time: Date): boolean {
    return this.attributes.started_at <= time && this.attributes.finished_at > time;
  }

  private convertToDate(key: string) {
    if (typeof (<any>this.attributes)[key] === 'string') {
      (<any>this.attributes)[key] = new Date((<any>this.attributes)[key]);
    }
  }
}
