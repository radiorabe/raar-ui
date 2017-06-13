import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ISubscription } from 'rxjs/Subscription';
import { ValidatedFormComponent } from '../../shared/components/validated-form.component';
import { ShowsService } from '../services/shows.service';
import { ShowModel } from '../models/show.model';

@Component({
  moduleId: module.id,
  selector: 'sd-show-form',
  templateUrl: 'show-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowFormComponent extends ValidatedFormComponent {

  show: ShowModel;

  title: string;

  private showSub: ISubscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private showsService: ShowsService,
              changeDetector: ChangeDetectorRef,
              fb: FormBuilder) {
    super(changeDetector);
    this.createForm(fb);
  }

  ngOnInit() {
    this.showSub = this.route.params
      .map(params => +params['id'])
      .distinctUntilChanged()
      .switchMap(id => id > 0 ? this.showsService.get(id) : this.newShow())
      .do(_ => window.scrollTo(0, 0))
      .subscribe(show => this.setShow(show));
  }

  ngOnDestroy() {
    this.showSub.unsubscribe();
  }

  onSubmit() {
    this.submitted = true;
    this.serializeShow();
    this.saveShow();
  }

  reset() {
    this.form.reset({
      name: this.show.attributes.name,
      details: this.show.attributes.details
    });
  }

  private setShow(show: ShowModel) {
    this.show = show;
    this.title = show.id ? show.attributes.name : 'Neue Sendung';
    this.reset();
    this.changeDetector.markForCheck();
  }

  private serializeShow() {
    const formModel = this.form.value;
    this.show.attributes.name = formModel.name
    this.show.attributes.details = formModel.details;
  }

  private createForm(fb: FormBuilder) {
    this.form = fb.group({
      name: ['', Validators.required],
      details: '',
      profile_id: ''
    });
  }

  private newShow(): Observable<ShowModel> {
    const show = new ShowModel();
    return Observable.of(show);
  }

  private saveShow() {
    let action: Observable<ShowModel>;
    if (this.show.id) {
      action = this.showsService.update(this.show);
    } else {
      action = this.showsService.create(this.show);
    }
    action.subscribe(
      show => this.router.navigate(['shows', show.id]),
      err => this.handleSubmitError(err));
  }
}
