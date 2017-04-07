import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({name: 'dateString'})
export class DateStringPipe implements PipeTransform {
  transform(value: Date, format: string): string {
    if (format === 'time') {
      return moment(value).format('HH:mm');
    } else if (format === 'date') {
      return moment(value).format('dddd D. MMMM YYYY');
    } else if (format === 'short') {
      return moment(value).format('dd, D. MMMM YYYY');
    } else {
      return moment(value).format('dd D.M.YYYY HH:mm');
    }
  }
}
