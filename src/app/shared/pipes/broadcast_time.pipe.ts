import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import {BroadcastModel} from '../models/broadcast.model';

@Pipe({name: 'broadcastTime'})
export class BroadcastTimePipe implements PipeTransform {
  transform(broadcast: BroadcastModel, format: string): string {
    let output = '';
    if (format == 'time') {
      output += moment(broadcast.attributes.started_at).format('HH:mm');
    } else {
      output += moment(broadcast.attributes.started_at).format('DD.MM. HH:mm');
    }
    output += ' - ';
    output += moment(broadcast.attributes.finished_at).format('HH:mm');
    return output;
  }
}
