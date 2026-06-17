import { AsyncPipe } from "@angular/common";
import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { InfiniteScrollDirective } from "ngx-infinite-scroll";
import { Observable, Observer, ReplaySubject, Subject, mergeWith } from "rxjs";
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  takeUntil,
  tap,
  withLatestFrom,
} from "rxjs/operators";
import { BroadcastModel, CrudList } from "../shared/models/index";
import { BroadcastComponent } from "./broadcast.component";
import { BroadcastsMonthlyComponent } from "./broadcasts-monthly.component";

@Component({
  selector: "sd-broadcasts-search",
  templateUrl: "broadcasts-monthly.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InfiniteScrollDirective, BroadcastComponent, AsyncPipe],
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
      mergeWith(
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
