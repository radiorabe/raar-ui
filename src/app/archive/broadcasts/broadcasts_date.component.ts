import {Component} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {BroadcastModel} from '../../shared/models/broadcast.model';
import {BroadcastsService} from '../../shared/services/broadcasts.service';
import {BroadcastComponent} from './broadcast.component';
import {DateStringPipe} from '../../shared/pipes/date_string.pipe';
import {ISubscription} from 'rxjs/Subscription';
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

  date: Observable<Date>;
  currentDate: Date;
  broadcasts: Observable<BroadcastModel[]>;

  private sub: ISubscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private broadcastsService: BroadcastsService) {
    this.date = this.route.params
          .distinctUntilChanged()
          .map(params => new Date(+params['year'], +params['month'] - 1, +params['day']));
    this.broadcasts = this.date
       .distinctUntilChanged()
       .flatMap(date => this.broadcastsService.getListForDate(date))
       .map(list => list.entries);
  }

  ngOnInit() {
    this.sub = this.date.subscribe(date => this.currentDate = date);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  prevDate(e: Event) {
    this.navigateTo(moment(this.currentDate).subtract(1, 'd').toDate());
    e.preventDefault();
  }

  nextDate(e: Event) {
    if (!this.nextDateDisabled()) {
      this.navigateTo(moment(this.currentDate).add(1, 'd').toDate());
    }
    e.preventDefault();
  }

  nextDateDisabled(): boolean {
    return this.currentDate >= moment().startOf('day').toDate();
  }

  getCrudIdentifier(i: number, model: BroadcastModel): number {
    return model.id;
  }

  private navigateTo(date: Date) {
    this.router.navigate([date.getFullYear(), date.getMonth() + 1, date.getDate()]);
  }

}
