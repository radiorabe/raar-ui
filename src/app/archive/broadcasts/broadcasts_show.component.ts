import {Component} from '@angular/core';
//import {InfiniteScroll} from 'angular2-infinite-scroll/angular2-infinite-scroll';
import {BroadcastModel, ShowModel} from '../../shared/models/index';
import {ArchiveService} from '../archive.service';
import {BroadcastComponent} from './broadcast.component';
import * as moment from 'moment';

@Component({
  moduleId: module.id,
  selector: 'sd-broadcasts-show',
  templateUrl: 'broadcasts_show.html',
  providers: [],
  directives: [BroadcastComponent] //, InfiniteScroll]
})
export class BroadcastsShowComponent {

  private _broadcasts: BroadcastModel[] = [];
  private _monthlyBroadcasts: { [id: string]: BroadcastModel[] } = {};

  constructor(private archive: ArchiveService) { }

  get broadcasts(): BroadcastModel[] {
    return this.archive.broadcasts;
  }

  get show(): ShowModel {
    return this.archive.show;
  }

  get monthlyBroadcasts(): { [id: string]: BroadcastModel[] } {
    if (this._broadcasts == this.broadcasts) {
      return this._monthlyBroadcasts;
    }

    const result: { [id: string]: BroadcastModel[] } = {};
    for (const b of this.broadcasts) {
      const label = moment(b.attributes.started_at).format('MMMM YYYY');
      if (result[label] === undefined) result[label] = [];
      result[label].push(b);
    }

    this._monthlyBroadcasts = result;
    this._broadcasts = this.broadcasts;
    return this._monthlyBroadcasts;
  }

  get months(): string[] {
    return Object.keys(this.monthlyBroadcasts);
  }

  getMonthIdentifier(i: number, month: string): string {
    return month;
  }

  getCrudIdentifier(i: number, model: BroadcastModel): number {
    return model.id;
  }

  onScroll() {
    if (this.archive.hasMoreBroadcasts()) {
      this.archive.fetchNextBroadcasts();
    }
  }

}
