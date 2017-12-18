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
  selector: 'sd-broadcasts-search',
  templateUrl: 'broadcasts_monthly.html'
})
export class BroadcastsSearchComponent extends BroadcastsMonthlyComponent implements OnInit {

  query: Subject<string> = new ReplaySubject<string>(1);

  title$: Observable<string> = this.query.map(q => `Suchresultate für «${q}»`);

  noBroadcastsMessage = 'Für diesen Begriff konnten keine Resultate gefunden werden.';

  constructor(route: ActivatedRoute,
              broadcastsService: BroadcastsService,
              refreshService: RefreshService) {
    super(route, broadcastsService, refreshService);
  }

  ngOnInit() {
    super.ngOnInit();

    this.route.params
      .takeUntil(this.destroy$)
      .map(params => params['query'])
      .filter((q: string) => q.length > 2)
      .distinctUntilChanged()
      .subscribe(this.query as Observer<any>);

    this.broadcastQueryObservable()
      .takeUntil(this.destroy$)
      .merge(this.broadcastMoreObservable())
      .subscribe(this.broadcastList);
  }

  private broadcastQueryObservable(): Observable<CrudList<BroadcastModel>> {
    return this.query
      .merge(this.refreshService.asObservable().withLatestFrom(this.query, (_, query) => query))
      .flatMap(query =>
        this.broadcastsService
          .getListForQuery(query)
          .do(_ => this.errorMessage = undefined)
          .catch(msg => this.handleListError(msg)));
  }

}
