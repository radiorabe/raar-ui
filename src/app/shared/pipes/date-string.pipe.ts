import { Pipe, PipeTransform } from "@angular/core";
import dayjs from "dayjs";

@Pipe({
    name: "dateString",
    standalone: false
})
export class DateStringPipe implements PipeTransform {
  transform(value: Date, format: string): string {
    if (format === "time") {
      return dayjs(value).format("HH:mm");
    } else if (format === "date") {
      return dayjs(value).format("dddd D. MMMM YYYY");
    } else if (format === "short") {
      return dayjs(value).format("dd, D. MMM YYYY");
    } else {
      return dayjs(value).format("dd D.M.YYYY HH:mm");
    }
  }
}
