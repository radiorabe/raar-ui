import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ISubscription } from 'rxjs/Subscription';
import { ShowsService } from '../services/shows.service';
import { ShowModel } from '../models/show.model';

@Component({
  moduleId: module.id,
  selector: 'sd-show-form',
  templateUrl: 'show-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowFormComponent {

  show: ShowModel;

  form: FormGroup;

  private showSub: ISubscription;

  constructor(private route: ActivatedRoute,
              private showsService: ShowsService,
              fb: FormBuilder) {
    this.createForm(fb);
  }

  ngOnInit() {
    this.showSub = this.route.params
      .map(params => +params['id'])
      .distinctUntilChanged()
      .switchMap(id => this.showsService.get(id))
      .do(_ => window.scrollTo(0, 0))
      .subscribe(show => this.setShow(show));
  }

  ngOnDestroy() {
    this.showSub.unsubscribe();
  }

  onSubmit() {
    this.serializeShow();
    this.showsService.update(this.show).subscribe(show => this.setShow(show));
  }

  reset() {
    this.form.reset({
      name: this.show.attributes.name,
      details: this.show.attributes.details
    });
  }

  private setShow(show: ShowModel) {
    this.show = show;
    this.reset();
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
}
