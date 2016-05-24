import {Component} from '@angular/core';
import {BroadcastModel} from '../../shared/models/broadcast.model';
import {ArchiveService} from '../archive.service';
import {BroadcastComponent} from './broadcast.component';
import {DateStringPipe} from '../../shared/pipes/date_string.pipe';
import * as moment from 'moment/moment';

@Component({
  moduleId: module.id,
  selector: 'sd-broadcasts-date',
  templateUrl: 'broadcasts_date.html',
  providers: [],
  directives: [BroadcastComponent],
  pipes: [DateStringPipe]
})
export class BroadcastsDateComponent {

  constructor(private archive: ArchiveService) { }

  get broadcasts(): BroadcastModel[] {
    return this.archive.broadcasts;
  }

  get date(): Date {
    return this.archive.date;
  }

  prevDate(e: Event) {
    this.archive.date = moment(this.archive.date).subtract(1, 'd').toDate();
    e.preventDefault();
  }

  nextDate(e: Event) {
    if (!this.nextDateDisabled()) {
      this.archive.date = moment(this.archive.date).add(1, 'd').toDate();
    }
    e.preventDefault();
  }

  nextDateDisabled(): boolean {
    return this.archive.date >= moment().startOf('day').toDate();
  }

  getCrudIdentifier(i: number, model: BroadcastModel): number {
    return model.id;
  }

}
