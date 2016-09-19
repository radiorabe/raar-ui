import {Component} from '@angular/core';
import {Control} from '@angular/common';
import {ROUTER_DIRECTIVES} from '@angular/router';
import { REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {ShowsService} from '../../shared/services/shows.service';
import {ShowModel} from '../../shared/models/show.model';
import {CrudList} from '../../shared/models/crud_list';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/filter';


@Component({
  moduleId: module.id,
  selector: 'sd-shows',
  templateUrl: 'shows.html',
  providers: [ShowsService],
  directives: [ROUTER_DIRECTIVES, REACTIVE_FORM_DIRECTIVES]
})
export class ShowsComponent {

  // maximally show this number of shows if no search query is given.
  private static MAX_INITIAL_SHOWS = 100;
  // list shows back to the beginning of this year (relative to today).
  private static RELATIVE_INITIAL_YEAR = -1;

  public shows: Observable<ShowModel[]>;

  public query: Control = new Control();

  constructor(private showService: ShowsService) {
    this.shows = this.showObservable();
  }

  private showObservable(): Observable<ShowModel[]> {
    return this.query.valueChanges
      .startWith('')
      .debounceTime(200)
      .filter(q => q.length === 0 || q.length > 2)
      .distinctUntilChanged()
      .switchMap(this.fetchShows.bind(this));
  }

  private fetchShows(q: string): Observable<ShowModel[]> {
    let observable = this.showService
      .getList(this.fetchParams(q))
      .map(list => list.entries);
    if (q.length === 0) {
      // sort shows by name as we get them ordered by last_broadcast_at.
      observable = observable.map(this.sortByName.bind(this));
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
    return entries.sort((a, b) => {
      if (a.attributes.name.toLowerCase() < b.attributes.name.toLowerCase()) return -1;
      if (a.attributes.name.toLowerCase() > b.attributes.name.toLowerCase()) return 1;
      return 0;
    });
  }

}
