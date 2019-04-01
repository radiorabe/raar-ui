import { Pipe, PipeTransform } from "@angular/core";
import { BroadcastModel } from "../models/broadcast.model";
import * as moment from "moment";

@Pipe({ name: "broadcastTime" })
export class BroadcastTimePipe implements PipeTransform {
  transform(broadcast: BroadcastModel, format: string): string {
    let output = moment(broadcast.attributes.started_at).format(
      this.startFormat(format)
    );
    output += " - ";
    output += moment(broadcast.attributes.finished_at).format("HH:mm");
    return output;
  }

  private startFormat(format: string): string {
    if (format === "time") {
      return "HH:mm";
    } else if (format === "full") {
      return "dd DD.MM.YYYY HH:mm";
    } else {
      return "dd DD.MM. HH:mm";
    }
  }
}
