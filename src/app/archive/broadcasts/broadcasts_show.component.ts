import {Component} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {ISubscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/withLatestFrom';
import {InfiniteScroll} from 'angular2-infinite-scroll';
import {BroadcastModel, ShowModel, CrudList} from '../../shared/models/index';
import {ShowsService} from '../../shared/services/shows.service';
import {BroadcastsService} from '../../shared/services/broadcasts.service';
import {BroadcastComponent} from './broadcast.component';
import * as moment from 'moment';

type MonthlyBroadcasts = { [id: string]: BroadcastModel[] };

@Component({
  moduleId: module.id,
  selector: 'sd-broadcasts-show',
  templateUrl: 'broadcasts_show.html',
  providers: [ShowsService],
  directives: [BroadcastComponent, InfiniteScroll]
})
export class BroadcastsShowComponent {

  title: string;
  show: Observable<ShowModel>;
  broadcastList: Subject<CrudList<BroadcastModel>> = new ReplaySubject<CrudList<BroadcastModel>>(1);
  monthlyBroadcasts: Subject<MonthlyBroadcasts> = new ReplaySubject<MonthlyBroadcasts>(1);

  private fetchMore: Subject<boolean> = new Subject<boolean>();
  private listSub: ISubscription;
  private monthlySub: ISubscription;
  private titleSub: ISubscription;

  constructor(private route: ActivatedRoute,
              private showsService: ShowsService,
              private broadcastsService: BroadcastsService) {
    this.show = this.route.params
          .distinctUntilChanged()
          .map(params => +params['id'])
          .distinctUntilChanged()
          .flatMap(id => this.showsService.get(id));
  }

  ngOnInit() {
    this.listSub = this.broadcastShowObservable()
      .merge(this.broadcastMoreObservable())
      .subscribe(this.broadcastList);

    this.monthlySub = this.broadcastList
      .map(list => list.entries)
      .map(broadcasts => this.buildMonthlyBroadcasts(broadcasts))
      .subscribe(this.monthlyBroadcasts);

    this.titleSub = this.show
      .subscribe(show => {
        this.title = show.attributes.name;
        window.scrollTo(0, 0);
      });
  }

  ngOnDestroy() {
    this.titleSub.unsubscribe();
    this.monthlySub.unsubscribe();
    this.listSub.unsubscribe();
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

  // TODO: same as in BroadcastDateComponnent
  isExpanded(broadcast: BroadcastModel): boolean {
    return false;
  }

  private broadcastShowObservable(): Observable<CrudList<BroadcastModel>> {
    return this.show
      .flatMap(show => this.broadcastsService.getListForShow(show));
  }

  private broadcastMoreObservable(): Observable<CrudList<BroadcastModel>> {
    return this.fetchMore
      .debounceTime(300)
      .withLatestFrom(this.broadcastList, (_, list) => list)
      .flatMap(list => this.broadcastsService.getNextEntries(list));
  }

}
