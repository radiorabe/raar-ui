import {Component} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {ISubscription} from 'rxjs/Subscription';
import {BroadcastModel, ShowModel, CrudList} from '../../shared/models/index';
import {ShowsService} from '../../shared/services/shows.service';
import {BroadcastsService} from '../../shared/services/broadcasts.service';
import {DateParamsService, RouteParams} from '../../shared/services/date_params.service';

import * as moment from 'moment';

type MonthlyBroadcasts = { [id: string]: BroadcastModel[] };

@Component({
  moduleId: module.id,
  selector: 'sd-broadcasts-show',
  templateUrl: 'broadcasts_show.html'
})
export class BroadcastsShowComponent {

  dateWithTime: Date;
  title: string;
  show: Subject<ShowModel> = new ReplaySubject<ShowModel>(1);
  broadcastList: Subject<CrudList<BroadcastModel>> = new ReplaySubject<CrudList<BroadcastModel>>(1);
  monthlyBroadcasts: Subject<MonthlyBroadcasts> = new ReplaySubject<MonthlyBroadcasts>(1);
  loading: boolean = false;
  hasMore: boolean = false;
  fetchingMore: boolean = false;

  private fetchMore: Subject<boolean> = new Subject<boolean>();
  private showSub: ISubscription;
  private listSub: ISubscription;
  private monthlySub: ISubscription;
  private dateWithTimeSub: ISubscription;
  private titleSub: ISubscription;

  constructor(private route: ActivatedRoute,
              private showsService: ShowsService,
              private broadcastsService: BroadcastsService) {
  }

  ngOnInit() {
    this.showSub = this.route.params
      .map(params => +params['id'])
      .distinctUntilChanged()
      .do(_ => this.loading = true)
      .flatMap(id => this.showsService.get(id))
      .subscribe(this.show);

    this.listSub = this.broadcastShowObservable()
      .merge(this.broadcastMoreObservable())
      .subscribe(this.broadcastList);

    this.monthlySub = this.broadcastList
      .do(list => this.hasMore = !!list.links.next)
      .map(list => list.entries)
      .map(broadcasts => this.buildMonthlyBroadcasts(broadcasts))
      .do(_ => { this.loading = false; this.fetchingMore = false })
      .subscribe(this.monthlyBroadcasts);

    this.dateWithTimeSub = this.route.params
      .subscribe(params => this.dateWithTime = this.getDateWithTime(params));

    this.titleSub = this.show
      .subscribe(show => {
        this.title = show.attributes.name;
        window.scrollTo(0, 0);
      })
  }

  ngOnDestroy() {
    this.monthlySub.unsubscribe();
    this.listSub.unsubscribe();
    this.dateWithTimeSub.unsubscribe();
    this.titleSub.unsubscribe();
    this.showSub.unsubscribe();
  }

  buildMonthlyBroadcasts(broadcasts: BroadcastModel[]): MonthlyBroadcasts {
    const result: MonthlyBroadcasts = {};
    for (const b of broadcasts) {
      const label = moment(b.attributes.started_at).format('MMMM YYYY');
      if (result[label] === undefined) result[label] = [];
      result[label].push(b);
    }
    return result;
  }

  get months(): Observable<string[]> {
    return this.monthlyBroadcasts.map(monthly => Object.keys(monthly));
  }

  getMonthIdentifier(i: number, month: string): string {
    return month;
  }

  getCrudIdentifier(i: number, model: BroadcastModel): number {
    return model.id;
  }

  onScroll() {
    this.fetchMore.next(true);
  }

  isExpanded(broadcast: BroadcastModel): boolean {
    return this.dateWithTime && broadcast.isCovering(this.dateWithTime);
  }

  private broadcastShowObservable(): Observable<CrudList<BroadcastModel>> {
    return this.show
      .flatMap(show => this.broadcastsService.getListForShow(show));
  }

  private broadcastMoreObservable(): Observable<CrudList<BroadcastModel>> {
    return this.fetchMore
      .withLatestFrom(this.broadcastList, (_, list) => list)
      .distinctUntilChanged(null, list => list.links.next)
      .do(_ => this.fetchingMore = true)
      .flatMap(list => this.broadcastsService.getNextEntries(list));
  }

  private getDateWithTime(params: RouteParams): Date {
    if (params['time'] && params['time'].length >= 4) {
      return DateParamsService.timeFromParams(params);
    } else {
      return undefined;
    }
  }
}
