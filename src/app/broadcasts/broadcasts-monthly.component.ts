import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable, of, ReplaySubject, Subject } from "rxjs";
import {
  catchError,
  distinctUntilChanged,
  map,
  merge,
  switchMap,
  takeUntil,
  tap,
  withLatestFrom,
} from "rxjs/operators";
import { BroadcastModel, CrudList } from "../shared/models/index";
import { BroadcastsService } from "../shared/services/broadcasts.service";
import {
  DateParamsService,
  RouteParams,
} from "../shared/services/date-params.service";
import { RefreshService } from "../shared/services/refresh.service";

import dayjs from "dayjs";
import { InfiniteScrollDirective } from "ngx-infinite-scroll";
import { BroadcastComponent } from "./broadcast.component";
import { AsyncPipe } from "@angular/common";

type MonthlyBroadcasts = { [id: string]: BroadcastModel[] };

@Component({
  selector: "sd-broadcasts-monthly",
  templateUrl: "broadcasts-monthly.html",
  imports: [InfiniteScrollDirective, BroadcastComponent, AsyncPipe],
})
export class BroadcastsMonthlyComponent implements OnInit, OnDestroy {
  dateWithTime: Date | void;
  broadcastList: Subject<CrudList<BroadcastModel>> = new ReplaySubject<
    CrudList<BroadcastModel>
  >(1);
  monthlyBroadcasts: Subject<MonthlyBroadcasts> =
    new ReplaySubject<MonthlyBroadcasts>(1);
  loading: boolean = false;
  hasMore: boolean = false;
  fetchingMore: boolean = false;
  errorMessage: string | void;

  title$: Observable<string> = of("");
  details$: Observable<string | void> = of(undefined);
  noBroadcastsMessage: string = "Keine Ausstrahlungen vorhanden.";

  protected route = inject(ActivatedRoute);
  protected broadcastsService = inject(BroadcastsService);
  protected refreshService = inject(RefreshService);

  protected fetchMore: Subject<void> = new Subject<void>();
  protected readonly destroy$ = new Subject<void>();

  ngOnInit() {
    this.broadcastLoadObservable()
      .pipe(takeUntil(this.destroy$), merge(this.broadcastMoreObservable()))
      .subscribe(this.broadcastList);

    this.broadcastList
      .pipe(
        takeUntil(this.destroy$),
        tap((list) => (this.hasMore = !!list.links.next)),
        map((list) => list.entries),
        map((broadcasts) => this.buildMonthlyBroadcasts(broadcasts)),
        tap((_) => {
          this.loading = false;
          this.fetchingMore = false;
        }),
      )
      .subscribe(this.monthlyBroadcasts);

    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (params) => (this.dateWithTime = this.getDateWithTime(params)),
      );
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  buildMonthlyBroadcasts(broadcasts: BroadcastModel[]): MonthlyBroadcasts {
    const result: MonthlyBroadcasts = {};
    for (const b of broadcasts) {
      const label = dayjs(b.attributes.started_at).format("MMMM YYYY");
      if (result[label] === undefined) result[label] = [];
      result[label].push(b);
    }
    return result;
  }

  get months(): Observable<string[]> {
    return this.monthlyBroadcasts.pipe(map((monthly) => Object.keys(monthly)));
  }

  onScroll() {
    this.fetchMore.next();
  }

  isExpanded(broadcast: BroadcastModel): boolean {
    return this.dateWithTime ? broadcast.isCovering(this.dateWithTime) : false;
  }

  protected broadcastLoadObservable(): Observable<CrudList<BroadcastModel>> {
    return of(undefined);
  }

  protected broadcastMoreObservable(): Observable<CrudList<BroadcastModel>> {
    return this.fetchMore.pipe(
      withLatestFrom(this.broadcastList, (_, list) => list),
      distinctUntilChanged(
        (a: CrudList<BroadcastModel>, b: CrudList<BroadcastModel>) =>
          a.links.next === b.links.next,
      ),
      tap(() => (this.fetchingMore = true)),
      switchMap((list: CrudList<BroadcastModel>) =>
        this.broadcastsService.getNextEntries(list).pipe(
          tap((_) => (this.errorMessage = undefined)),
          catchError((msg) => this.handleListError(msg)),
        ),
      ),
    );
  }

  protected handleListError(
    message: string,
  ): Observable<CrudList<BroadcastModel>> {
    this.errorMessage = message;
    return of(new CrudList<BroadcastModel>());
  }

  private getDateWithTime(params: RouteParams): Date | void {
    if (params["time"] && params["time"].length >= 4) {
      return DateParamsService.timeFromParams(params);
    }
  }
}
