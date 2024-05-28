import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as dayjs from "dayjs";
import { Observable, of, Subject } from "rxjs";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  merge,
  switchMap,
  takeUntil,
  tap,
  withLatestFrom,
} from "rxjs/operators";
import { BroadcastModel } from "../shared/models/broadcast.model";
import { CrudList } from "../shared/models/crud-list";
import { BroadcastsService } from "../shared/services/broadcasts.service";
import {
  DateParamsService,
  RouteParams,
} from "../shared/services/date-params.service";
import { RefreshService } from "../shared/services/refresh.service";

@Component({
  selector: "sd-broadcasts-date",
  templateUrl: "broadcasts-date.html",
})
export class BroadcastsDateComponent implements OnInit, OnDestroy {
  date: Date;
  dateWithTime: Date | void;
  broadcasts: BroadcastModel[] = [];
  loading: boolean = false;
  errorMessage: string | void;
  lastTodaysBroadcastFinishedAt: Date | undefined;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private broadcastsService: BroadcastsService,
    private refreshService: RefreshService,
  ) {}

  ngOnInit() {
    const paramsObservable = this.route.params;
    const dateObservable = paramsObservable.pipe(
      map((params) => this.getDate(params)),
    );

    dateObservable
      .pipe(takeUntil(this.destroy$))
      .subscribe((date) => (this.date = date));

    paramsObservable
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (params) => (this.dateWithTime = this.getDateWithTime(params)),
      );

    dateObservable
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged((a: Date, b: Date) => a.getTime() === b.getTime()),
        merge(
          this.refreshService
            .asObservable()
            .pipe(withLatestFrom(dateObservable, (_, date) => date)),
        ),
        tap(() => {
          this.loading = true;
          this.lastTodaysBroadcastFinishedAt = undefined;
        }),
        debounceTime(200),
        switchMap((date: Date) =>
          this.broadcastsService.getListForDate(date).pipe(
            tap((_) => (this.errorMessage = undefined)),
            catchError(this.handleHttpError.bind(this)),
          ),
        ),
        map((list: CrudList<BroadcastModel>) => list.entries),
        tap(() => (this.loading = false)),
      )
      .subscribe((list: BroadcastModel[]) => {
        this.broadcasts = list;
        this.lastTodaysBroadcastFinishedAt =
          this.fetchLastTodaysBroadcastFinishedAt();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  prevDate() {
    this.navigateTo(dayjs(this.date).subtract(1, "d").toDate());
  }

  nextDate() {
    if (!this.nextDateDisabled()) {
      this.navigateTo(dayjs(this.date).add(1, "d").toDate());
    }
  }

  nextDateDisabled(): boolean {
    return this.date >= dayjs().startOf("day").toDate();
  }

  getCrudIdentifier(i: number, model: BroadcastModel): number {
    return model.id;
  }

  isExpanded(broadcast: BroadcastModel): boolean {
    return this.dateWithTime ? broadcast.isCovering(this.dateWithTime) : false;
  }

  isRunningExpanded(): boolean {
    return this.dateWithTime && this.lastTodaysBroadcastFinishedAt
      ? dayjs(this.dateWithTime).isSame(this.lastTodaysBroadcastFinishedAt)
      : false;
  }

  private navigateTo(date: Date) {
    this.router.navigate([
      date.getFullYear(),
      DateParamsService.zeroPad(date.getMonth() + 1),
      DateParamsService.zeroPad(date.getDate()),
    ]);
  }

  private getDate(params: RouteParams): Date {
    if (params["year"]) {
      return DateParamsService.dateFromParams(params);
    } else {
      const today = new Date(new Date().setHours(0, 0, 0, 0));
      this.navigateTo(today);
      return today;
    }
  }

  private getDateWithTime(params: RouteParams): Date | void {
    if (params["time"] && params["time"].length >= 4) {
      return DateParamsService.timeFromParams(params);
    }
  }

  // Actually, today or yesterdays last broadcast
  private fetchLastTodaysBroadcastFinishedAt(): Date | undefined {
    const diff = dayjs(this.date).diff(dayjs(), "days");
    if (diff === 0 || diff === -1) {
      if (this.broadcasts.length) {
        const last = this.broadcasts[this.broadcasts.length - 1];
        if (last.attributes.finished_at.getDate() === this.date.getDate()) {
          return last.attributes.finished_at;
        }
      } else {
        return this.date;
      }
    }
  }

  private handleHttpError(
    message: string,
  ): Observable<CrudList<BroadcastModel>> {
    this.errorMessage = message;
    return of(new CrudList<BroadcastModel>());
  }
}
