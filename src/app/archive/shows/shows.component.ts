import {Component} from '@angular/core';
import {Control} from '@angular/common';
import {Observable} from 'rxjs/Observable';
import {ShowsService} from '../../shared/services/shows.service';
import {ShowModel} from '../../shared/models/show.model';
import {ArchiveService} from '../archive.service';
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
  directives: []
})
export class ShowsComponent {

  public shows: Observable<ShowModel[]>;
  
  public query: Control = new Control();

  constructor(private showService: ShowsService, private archive: ArchiveService) {
    this.shows = this.showObservable();
  }

  public select(show: ShowModel, e: Event) {
    this.archive.show = show;
    e.preventDefault();
  }

  public get selected(): ShowModel {
    return this.archive.show;
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
