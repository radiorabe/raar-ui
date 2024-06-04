import { Pipe, PipeTransform } from "@angular/core";
import dayjs from "dayjs";
import { BroadcastModel } from "../models/broadcast.model";

@Pipe({ name: "broadcastTime" })
export class BroadcastTimePipe implements PipeTransform {
  transform(broadcast: BroadcastModel, format: string): string {
    let output = dayjs(broadcast.attributes.started_at).format(
      this.startFormat(format),
    );
    output += " - ";
    output += dayjs(broadcast.attributes.finished_at).format("HH:mm");
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
