import { AsyncPipe } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import { InfiniteScrollDirective } from "ngx-infinite-scroll";
import { Observable, Observer, ReplaySubject, Subject, of } from "rxjs";
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
import { BroadcastModel, CrudList, ShowModel } from "../shared/models/index";
import { ShowsService } from "../shared/services/shows.service";
import { BroadcastComponent } from "./broadcast.component";
import { BroadcastsMonthlyComponent } from "./broadcasts-monthly.component";

@Component({
  selector: "sd-broadcasts-show",
  templateUrl: "broadcasts-monthly.html",
  imports: [InfiniteScrollDirective, BroadcastComponent, AsyncPipe],
})
export class BroadcastsShowComponent
  extends BroadcastsMonthlyComponent
  implements OnInit
{
  show: Subject<ShowModel> = new ReplaySubject<ShowModel>(1);
  details$ = this.show.pipe(map((show) => show.attributes.details));
  title$ = this.show.pipe(map((show) => show.attributes.name));
  noBroadcastsMessage = "Für diese Sendung existieren keine Ausstrahlungen.";

  private showsService = inject(ShowsService);

  ngOnInit() {
    super.ngOnInit();

    this.route.params
      .pipe(
        takeUntil(this.destroy$),
        map((params) => parseInt(params["id"])),
        distinctUntilChanged(),
        tap((_) => (this.loading = true)),
        switchMap((id) =>
          this.showsService.get(id).pipe(
            tap(() => (this.errorMessage = undefined)),
            catchError(this.handleShowError.bind(this)),
          ),
        ),
        tap((_) => window.scrollTo(0, 0)),
      )
      .subscribe(this.show as Observer<any>);
  }

  protected broadcastLoadObservable(): Observable<CrudList<BroadcastModel>> {
    return this.show.pipe(
      merge(
        this.refreshService
          .asObservable()
          .pipe(withLatestFrom(this.show, (_, show) => show)),
      ),
      switchMap((show) =>
        this.broadcastsService.getListForShow(show).pipe(
          tap((_) => (this.errorMessage = undefined)),
          catchError((msg) => this.handleListError(msg)),
        ),
      ),
    );
  }

  private handleShowError(message: string): Observable<ShowModel> {
    this.errorMessage = message;
    return of(new ShowModel());
  }
}
