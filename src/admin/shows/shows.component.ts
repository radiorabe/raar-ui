import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ShowsService } from '../../app/shared/services/shows.service';
import { ShowModel } from '../../app/shared/models/show.model';

@Component({
  moduleId: module.id,
  selector: 'sd-shows',
  templateUrl: 'shows.html'
})
export class ShowsComponent {

  public shows: Observable<ShowModel[]>;

  public query: FormControl = new FormControl();

  constructor(private showService: ShowsService) {
    this.shows = this.showObservable();
  }

  private showObservable(): Observable<ShowModel[]> {
    return this.query.valueChanges
      .startWith('')
      .debounceTime(200)
      .filter((q: string) => q.length === 0 || q.length > 2)
      .distinctUntilChanged()
      .switchMap(q => this.fetchShows(q));
  }

  private fetchShows(q: string): Observable<ShowModel[]> {
    return this.showService
      .getList({ q: q, sort: 'name', 'page[size]': 500 })
      .map(list => list.entries)
      .catch(_ => Observable.of([]));
  }

}
