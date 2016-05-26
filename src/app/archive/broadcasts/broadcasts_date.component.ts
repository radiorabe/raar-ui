import {Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';
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

  date: Date;

  constructor(private archive: ArchiveService) {
    this.archive.date.subscribe(date => this.date = date);
  }

  get broadcasts(): Observable<BroadcastModel[]> {
    return this.archive.broadcasts;
  }

  prevDate(e: Event) {
    this.archive.setDate(moment(this.date).subtract(1, 'd').toDate());
    e.preventDefault();
  }

  nextDate(e: Event) {
    if (!this.nextDateDisabled()) {
      this.archive.setDate(moment(this.date).add(1, 'd').toDate());
    }
    e.preventDefault();
  }

  nextDateDisabled(): boolean {
    return this.date >= moment().startOf('day').toDate();
  }

  getCrudIdentifier(i: number, model: BroadcastModel): number {
    return model.id;
  }

}
