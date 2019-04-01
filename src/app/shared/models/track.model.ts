import { CrudModel } from "./crud.model";

export class TrackModel extends CrudModel {
  attributes: {
    title: string;
    artist: string | void;
    started_at: Date;
    finished_at: Date;
  };

  init() {
    this.convertToDate("started_at");
    this.convertToDate("finished_at");
  }

  isCovering(time: Date): boolean {
    return (
      this.attributes.started_at <= time && this.attributes.finished_at > time
    );
  }

  private convertToDate(key: string) {
    if (typeof (<any>this.attributes)[key] === "string") {
      (<any>this.attributes)[key] = new Date((<any>this.attributes)[key]);
    }
  }
}
