import {Component} from '@angular/core';
import {ShowsService} from '../../shared/services/shows.service';
import {ShowModel} from '../../shared/models/show.model';
import {ArchiveService} from '../archive.service';


@Component({
  moduleId: module.id,
  selector: 'sd-shows',
  templateUrl: 'shows.html',
  providers: [ShowsService],
  directives: []
})
export class ShowsComponent {

  public shows: ShowModel[] = [];

  constructor(private crud: ShowsService, private archive: ArchiveService) {
    crud.getList().subscribe(list => this.shows = list.entries);
  }

  public search(query: string) {
    if (query.length > 2) {
      this.crud.getList({ q: query }).subscribe(list => this.shows = list.entries);
    } else if (query.length == 0) {
      this.crud.getList().subscribe(list => this.shows = list.entries);
    }
  }

  public select(show: ShowModel, e: Event) {
    this.archive.show = show;
    e.preventDefault();
  }

  public get selected(): ShowModel {
    return this.archive.show;
  }
}
