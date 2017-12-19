import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { BroadcastModel, ShowModel, CrudList } from '../../shared/models/index';
import { ShowsService } from '../../shared/services/shows.service';
import { BroadcastsService } from '../../shared/services/broadcasts.service';
import { RefreshService } from '../shared/services/refresh.service';
import { BroadcastsMonthlyComponent } from './broadcasts_monthly.component';

import * as moment from 'moment';

@Component({
  moduleId: module.id,
  selector: 'sd-broadcasts-show',
  templateUrl: 'broadcasts_monthly.html'
})
export class BroadcastsShowComponent extends BroadcastsMonthlyComponent implements OnInit {

  show: Subject<ShowModel> = new ReplaySubject<ShowModel>(1);
  details$ = this.show.map(show => show.attributes.details);
  title$ = this.show.map(show => show.attributes.name);
  noBroadcastsMessage = 'Für diese Sendung existieren keine Ausstrahlungen.';

  constructor(route: ActivatedRoute,
              private showsService: ShowsService,
              broadcastsService: BroadcastsService,
              refreshService: RefreshService) {
    super(route, broadcastsService, refreshService);
  }

  ngOnInit() {
    super.ngOnInit();

    this.route.params
      .takeUntil(this.destroy$)
      .map(params => parseInt(params['id']))
      .distinctUntilChanged()
      .do(_ => this.loading = true)
      .switchMap(id =>
        this.showsService
          .get(id)
          .do(() => this.errorMessage = undefined)
          .catch(this.handleShowError.bind(this)))
      .do(_ => window.scrollTo(0, 0))
      .subscribe(this.show as Observer<any>);
  }

  protected broadcastLoadObservable(): Observable<CrudList<BroadcastModel>> {
    return this.show
      .merge(this.refreshService.asObservable().withLatestFrom(this.show, (_, show) => show))
      .switchMap(show =>
        this.broadcastsService
          .getListForShow(show)
          .do(_ => this.errorMessage = undefined)
          .catch(msg => this.handleListError(msg)));
  }

  private handleShowError(message: string): Observable<ShowModel> {
    this.errorMessage = message;
    return Observable.of(new ShowModel());
  }

}
