import {Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/share';
//import {InfiniteScroll} from 'angular2-infinite-scroll/angular2-infinite-scroll';
import {BroadcastModel, ShowModel} from '../../shared/models/index';
import {ArchiveService} from '../archive.service';
import {BroadcastComponent} from './broadcast.component';
import * as moment from 'moment';

type MonthlyBroadcasts = { [id: string]: BroadcastModel[] };

@Component({
  moduleId: module.id,
  selector: 'sd-broadcasts-show',
  templateUrl: 'broadcasts_show.html',
  providers: [],
  directives: [BroadcastComponent] //, InfiniteScroll]
})
export class BroadcastsShowComponent {

  title: string;
  monthlyBroadcasts: Subject<MonthlyBroadcasts> = new ReplaySubject<MonthlyBroadcasts>(1);

  constructor(private archive: ArchiveService) {
    this.archive.broadcasts
      .map(broadcasts => this.buildMonthlyBroadcasts(broadcasts))
      .subscribe(this.monthlyBroadcasts);

    this.archive.show.subscribe(show => {
      if (show) this.title = show.attributes.name;
    });
  }

  get show(): Observable<ShowModel> {
    return this.archive.show;
  }

  buildMonthlyBroadcasts(broadcasts: BroadcastModel[]): MonthlyBroadcasts {
      const result: { [id: string]: BroadcastModel[] } = {};
      for (const b of broadcasts) {
        const label = moment(b.attributes.started_at).format('MMMM YYYY');
        if (result[label] === undefined) result[label] = [];
        result[label].push(b);
      }
      return result;
  }

  get months(): Observable<string[]> {
    return this.monthlyBroadcasts.map(monthly => Object.keys(monthly));
  }

  getMonthIdentifier(i: number, month: string): string {
    return month;
  }

  getCrudIdentifier(i: number, model: BroadcastModel): number {
    return model.id;
  }

  onScroll() {
    this.archive.fetchNextBroadcasts();
  }

}
