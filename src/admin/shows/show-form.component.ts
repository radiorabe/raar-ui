import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ISubscription } from 'rxjs/Subscription';
import { ShowsService } from '../../app/shared/services/shows.service';
import { ShowModel } from '../../app/shared/models/show.model';

@Component({
  moduleId: module.id,
  selector: 'sd-show-form',
  templateUrl: 'show-form.html'
})
export class ShowFormComponent {

  show: Subject<ShowModel> = new ReplaySubject<ShowModel>(1);

  private showSub: ISubscription;

  constructor(private route: ActivatedRoute,
              private showsService: ShowsService) {

  }

  ngOnInit() {
    this.showSub = this.route.params
      .map(params => +params['id'])
      .distinctUntilChanged()
      .switchMap(id => this.showsService.get(id))
      .do(_ => window.scrollTo(0, 0))
      .subscribe(this.show as Observer<any>);
  }

  ngOnDestroy() {
    this.showSub.unsubscribe();
  }
}
