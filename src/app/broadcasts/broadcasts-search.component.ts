import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable, Subject, ReplaySubject, Observer } from "rxjs";
import {
  map,
  takeUntil,
  filter,
  distinctUntilChanged,
  tap,
  merge,
  withLatestFrom,
  switchMap,
  catchError,
} from "rxjs/operators";
import { BroadcastModel, CrudList } from "../shared/models/index";
import { BroadcastsService } from "../shared/services/broadcasts.service";
import { RefreshService } from "../shared/services/refresh.service";
import { BroadcastsMonthlyComponent } from "./broadcasts-monthly.component";

@Component({
  selector: "sd-broadcasts-search",
  templateUrl: "broadcasts-monthly.html",
})
export class BroadcastsSearchComponent
  extends BroadcastsMonthlyComponent
  implements OnInit
{
  query: Subject<string> = new ReplaySubject<string>(1);

  title$: Observable<string> = this.query.pipe(
    map((q) => `Suchresultate für «${q}»`),
  );

  noBroadcastsMessage =
    "Für diesen Begriff konnten keine Resultate gefunden werden.";

  constructor(
    route: ActivatedRoute,
    broadcastsService: BroadcastsService,
    refreshService: RefreshService,
  ) {
    super(route, broadcastsService, refreshService);
  }

  ngOnInit() {
    super.ngOnInit();

    this.route.params
      .pipe(
        takeUntil(this.destroy$),
        map((params) => params["query"]),
        filter((q: string) => q.length > 2),
        distinctUntilChanged(),
        tap((_) => (this.loading = true)),
      )
      .subscribe(this.query as Observer<any>);
  }

  protected broadcastLoadObservable(): Observable<CrudList<BroadcastModel>> {
    return this.query.pipe(
      merge(
        this.refreshService
          .asObservable()
          .pipe(withLatestFrom(this.query, (_, query) => query)),
      ),
      switchMap((query) =>
        this.broadcastsService.getListForQuery(query).pipe(
          tap((_) => (this.errorMessage = undefined)),
          catchError((msg) => this.handleListError(msg)),
        ),
      ),
    );
  }
}
