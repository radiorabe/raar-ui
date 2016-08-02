import {Component} from '@angular/core';
import {Control} from '@angular/common';
import {ROUTER_DIRECTIVES} from '@angular/router';
import { REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {ShowsService} from '../../shared/services/shows.service';
import {ShowModel} from '../../shared/models/show.model';
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

  public shows: Observable<ShowModel[]>;

  public query: Control = new Control();

  constructor(private showService: ShowsService) {
    this.shows = this.showObservable();
  }

  private showObservable(): Observable<ShowModel[]> {
    return this.query.valueChanges
      .startWith('')
      .debounceTime(200)
      .filter(q => q.length == 0 || q.length > 2)
      .distinctUntilChanged()
      .switchMap(q => this.showService.getList({ q: q }))
      .map(list => list.entries);
  }
}
