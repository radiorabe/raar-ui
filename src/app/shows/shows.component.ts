import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable, of } from "rxjs";
import {
  startWith,
  debounceTime,
  filter,
  distinctUntilChanged,
  merge,
  map,
  switchMap,
  catchError
} from "rxjs/operators";
import { ShowsService } from "../shared/services/shows.service";
import { ShowModel } from "../shared/models/show.model";
import { RefreshService } from "../shared/services/refresh.service";
import { UrlSlugService } from "../shared/services/url-slug.service";

@Component({
  selector: "sd-shows",
  templateUrl: "shows.html"
})
export class ShowsComponent {
  // maximally show this number of shows if no search query is given.
  private static MAX_INITIAL_SHOWS = 100;
  // list shows back to the beginning of this year (relative to today).
  private static RELATIVE_INITIAL_YEAR = -1;

  query: FormControl = new FormControl();

  shows: Observable<ShowModel[]> = this.query.valueChanges.pipe(
    startWith(""),
    debounceTime(200),
    filter((q: string) => q.length === 0 || q.length > 2),
    distinctUntilChanged(),
    merge(this.refreshService.asObservable().pipe(map(_ => ""))),
    switchMap(q => this.fetchShows(q))
  );

  constructor(
    private showService: ShowsService,
    private refreshService: RefreshService
  ) {}

  getShowLink(show: ShowModel): string[] {
    return [
      "/show",
      show.id + "-" + UrlSlugService.escape(show.attributes.name)
    ];
  }

  private fetchShows(q: string): Observable<ShowModel[]> {
    let observable: Observable<ShowModel[]> = this.showService
      .getList(this.fetchParams(q))
      .pipe(
        map(list => list.entries),
        catchError(_ => of([]))
      );
    if (q.length === 0) {
      // sort shows by name as we get them ordered by last_broadcast_at.
      observable = observable.pipe(map(list => this.sortByName(list)));
    }
    return observable;
  }

  private fetchParams(q: string): any {
    if (q.length === 0) {
      const year =
        new Date().getFullYear() + ShowsComponent.RELATIVE_INITIAL_YEAR;
      return {
        since: year.toString() + "-01-01",
        sort: "-last_broadcast_at",
        "page[size]": ShowsComponent.MAX_INITIAL_SHOWS
      };
    } else {
      return {
        q: q,
        sort: "name"
      };
    }
  }

  private sortByName(entries: ShowModel[]): ShowModel[] {
    return entries.sort((a, b) =>
      a.attributes.name.localeCompare(b.attributes.name)
    );
  }
}
