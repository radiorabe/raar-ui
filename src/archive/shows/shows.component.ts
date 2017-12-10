import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ShowsService } from '../../shared/services/shows.service';
import { ShowModel } from '../../shared/models/show.model';
import { RefreshService } from '../shared/services/refresh.service';
import { UrlSlugService } from '../../shared/services/url-slug.service';

@Component({
  moduleId: module.id,
  selector: 'sd-shows',
  templateUrl: 'shows.html'
})
export class ShowsComponent {

  // maximally show this number of shows if no search query is given.
  private static MAX_INITIAL_SHOWS = 100;
  // list shows back to the beginning of this year (relative to today).
  private static RELATIVE_INITIAL_YEAR = -1;

  query: FormControl = new FormControl();

  shows: Observable<ShowModel[]> =
    this.query.valueChanges
      .startWith('')
      .debounceTime(200)
      .filter((q: string) => q.length === 0 || q.length > 2)
      .distinctUntilChanged()
      .merge(this.refreshService.asObservable().map(_ => ''))
      .switchMap(q => this.fetchShows(q));

  constructor(private showService: ShowsService,
              private refreshService: RefreshService) {
  }

  getShowLink(show: ShowModel): string[] {
    return ['/show', show.id + '-' + UrlSlugService.escape(show.attributes.name)];
  }

  private fetchShows(q: string): Observable<ShowModel[]> {
    let observable: Observable<ShowModel[]> = this.showService
      .getList(this.fetchParams(q))
      .map(list => list.entries)
      .catch(_ => Observable.of([]));
    if (q.length === 0) {
      // sort shows by name as we get them ordered by last_broadcast_at.
      observable = observable.map(list => this.sortByName(list));
    }
    return observable;
  }

  private fetchParams(q: string): any {
    if (q.length === 0) {
      const year = new Date().getFullYear() + ShowsComponent.RELATIVE_INITIAL_YEAR;
      return {
        since: year.toString() + '-01-01',
        sort: '-last_broadcast_at',
        'page[size]': ShowsComponent.MAX_INITIAL_SHOWS
      };
    } else {
      return {
        q: q,
        sort: 'name'
      };
    }
  }

  private sortByName(entries: ShowModel[]): ShowModel[] {
    return entries.sort((a, b) => a.attributes.name.localeCompare(b.attributes.name));
  }

}
