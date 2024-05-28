import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable, Observer, Subject, ReplaySubject, of } from "rxjs";
import {
  map,
  takeUntil,
  distinctUntilChanged,
  tap,
  switchMap,
  catchError,
  merge,
  withLatestFrom,
} from "rxjs/operators";
import { BroadcastModel, ShowModel, CrudList } from "../shared/models/index";
import { ShowsService } from "../shared/services/shows.service";
import { BroadcastsService } from "../shared/services/broadcasts.service";
import { RefreshService } from "../shared/services/refresh.service";
import { BroadcastsMonthlyComponent } from "./broadcasts-monthly.component";

@Component({
  selector: "sd-broadcasts-show",
  templateUrl: "broadcasts-monthly.html",
})
export class BroadcastsShowComponent
  extends BroadcastsMonthlyComponent
  implements OnInit
{
  show: Subject<ShowModel> = new ReplaySubject<ShowModel>(1);
  details$ = this.show.pipe(map((show) => show.attributes.details));
  title$ = this.show.pipe(map((show) => show.attributes.name));
  noBroadcastsMessage = "Für diese Sendung existieren keine Ausstrahlungen.";

  constructor(
    route: ActivatedRoute,
    private showsService: ShowsService,
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
