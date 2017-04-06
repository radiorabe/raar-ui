import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ISubscription } from 'rxjs/Subscription';
import { CrudList } from '../../shared/models/crud_list';
import { BroadcastModel } from '../../shared/models/broadcast.model';
import { BroadcastsService } from '../../shared/services/broadcasts.service';
import { DateParamsService, RouteParams } from '../../shared/services/date_params.service';
import * as moment from 'moment/moment';

@Component({
  moduleId: module.id,
  selector: 'sd-broadcasts-date',
  templateUrl: 'broadcasts_date.html'
})
export class BroadcastsDateComponent implements OnInit, OnDestroy {

  date: Date;
  dateWithTime: Date;
  broadcasts: BroadcastModel[] = [];
  loading: boolean = false;
  errorMessage: string;

  private dateSub: ISubscription;
  private dateWithTimeSub: ISubscription;
  private broadcastsSub: ISubscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private broadcastsService: BroadcastsService) {
  }

  ngOnInit() {
    const paramsObservable = this.route.params;
    const dateObservable = paramsObservable.map(params => this.getDate(params));

    this.dateSub = dateObservable.subscribe(date => this.date = date);
    this.dateWithTimeSub = paramsObservable
      .subscribe(params => this.dateWithTime = this.getDateWithTime(params));
    this.broadcastsSub = dateObservable
      .distinctUntilChanged(null, date => date.getTime())
      .do(_ => this.loading = true)
      .debounceTime(200)
      .switchMap(date =>
        this.broadcastsService
          .getListForDate(date)
          .do(_ => this.errorMessage = undefined)
          .catch(this.handleHttpError.bind(this)))
      .map((list: CrudList<BroadcastModel>) => list.entries)
      .do(_ => this.loading = false)
      .subscribe(list => this.broadcasts = list);
  }

  ngOnDestroy() {
    this.dateSub.unsubscribe();
    this.dateWithTimeSub.unsubscribe();
    this.broadcastsSub.unsubscribe();
  }

  prevDate() {
    this.navigateTo(moment(this.date).subtract(1, 'd').toDate());
  }

  nextDate() {
    if (!this.nextDateDisabled()) {
      this.navigateTo(moment(this.date).add(1, 'd').toDate());
    }
  }

  nextDateDisabled(): boolean {
    return this.date >= moment().startOf('day').toDate();
  }

  getCrudIdentifier(i: number, model: BroadcastModel): number {
    return model.id;
  }

  isExpanded(broadcast: BroadcastModel): boolean {
    return this.dateWithTime && broadcast.isCovering(this.dateWithTime);
  }

  private navigateTo(date: Date) {
    this.router.navigate([date.getFullYear(), date.getMonth() + 1, date.getDate()]);
  }

  private getDate(params: RouteParams): Date {
    if (params['year']) {
      return DateParamsService.dateFromParams(params);
    } else {
      return new Date(new Date().setHours(0, 0, 0, 0));
    }
  }

  private getDateWithTime(params: RouteParams): Date {
    if (params['time'] && params['time'].length >= 4) {
      return DateParamsService.timeFromParams(params);
    } else {
      return undefined;
    }
  }

  private handleHttpError(message: string): Observable<CrudList<BroadcastModel>> {
    this.errorMessage = message;
    return Observable.of(new CrudList<BroadcastModel>());
  }
}
