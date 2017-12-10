import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { BroadcastModel, ShowModel, CrudList } from '../../shared/models/index';
import { ShowsService } from '../../shared/services/shows.service';
import { BroadcastsService } from '../../shared/services/broadcasts.service';
import { RefreshService } from '../shared/services/refresh.service';
import { DateParamsService, RouteParams } from '../../shared/services/date_params.service';

import * as moment from 'moment';

type MonthlyBroadcasts = { [id: string]: BroadcastModel[] };

@Component({
  moduleId: module.id,
  selector: 'sd-broadcasts-show',
  templateUrl: 'broadcasts_show.html'
})
export class BroadcastsShowComponent implements OnInit, OnDestroy {

  dateWithTime: Date | void;
  title: string | void;
  details: string | void;
  show: Subject<ShowModel> = new ReplaySubject<ShowModel>(1);
  broadcastList: Subject<CrudList<BroadcastModel>> = new ReplaySubject<CrudList<BroadcastModel>>(1);
  monthlyBroadcasts: Subject<MonthlyBroadcasts> = new ReplaySubject<MonthlyBroadcasts>(1);
  loading: boolean = false;
  hasMore: boolean = false;
  fetchingMore: boolean = false;
  errorMessage: string | void;

  private fetchMore: Subject<void> = new Subject<void>();
  private readonly destroy$ = new Subject();

  constructor(private route: ActivatedRoute,
              private showsService: ShowsService,
              private broadcastsService: BroadcastsService,
              private refreshService: RefreshService) {
  }

  ngOnInit() {
    this.route.params
      .takeUntil(this.destroy$)
      .map(params => parseInt(params['id']))
      .distinctUntilChanged()
      .do(_ => this.loading = true)
      .switchMap(id =>
        this.showsService
          .get(id)
          .do(() => this.errorMessage = undefined)
          .catch(this.handleShowError.bind(this)))
      .subscribe(this.show as Observer<any>);

    this.broadcastShowObservable()
      .takeUntil(this.destroy$)
      .merge(this.broadcastMoreObservable())
      .subscribe(this.broadcastList);

    this.broadcastList
      .takeUntil(this.destroy$)
      .do(list => this.hasMore = !!list.links.next)
      .map(list => list.entries)
      .map(broadcasts => this.buildMonthlyBroadcasts(broadcasts))
      .do(_ => { this.loading = false; this.fetchingMore = false; })
      .subscribe(this.monthlyBroadcasts);

    this.route.params
      .takeUntil(this.destroy$)
      .subscribe(params => this.dateWithTime = this.getDateWithTime(params));

    this.show
      .takeUntil(this.destroy$)
      .subscribe(show => {
        this.title = show.attributes.name;
        this.details = show.attributes.details;
        window.scrollTo(0, 0);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
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
    this.fetchMore.next();
  }

  isExpanded(broadcast: BroadcastModel): boolean {
    return this.dateWithTime ? broadcast.isCovering(this.dateWithTime) : false;
  }

  private broadcastShowObservable(): Observable<CrudList<BroadcastModel>> {
    return this.show
      .merge(this.refreshService.asObservable().withLatestFrom(this.show, (_, show) => show))
      .flatMap(show =>
        this.broadcastsService
          .getListForShow(show)
          .do(_ => this.errorMessage = undefined)
          .catch(msg => this.handleListError(msg)));
  }

  private broadcastMoreObservable(): Observable<CrudList<BroadcastModel>> {
    return this.fetchMore
      .withLatestFrom(this.broadcastList, (_, list) => list)
      .distinctUntilChanged((a: CrudList<BroadcastModel>, b: CrudList<BroadcastModel>) =>
        a.links.next === b.links.next
      )
      .do(() => this.fetchingMore = true)
      .switchMap((list: CrudList<BroadcastModel>) =>
        this.broadcastsService
          .getNextEntries(list)
          .do(_ => this.errorMessage = undefined)
          .catch(msg => this.handleListError(msg)));
  }

  private getDateWithTime(params: RouteParams): Date | void {
    if (params['time'] && params['time'].length >= 4) {
      return DateParamsService.timeFromParams(params);
    }
  }

  private handleListError(message: string): Observable<CrudList<BroadcastModel>> {
    this.errorMessage = message;
    return Observable.of(new CrudList<BroadcastModel>());
  }

  private handleShowError(message: string): Observable<ShowModel> {
    this.errorMessage = message;
    return Observable.of(new ShowModel());
  }

}
