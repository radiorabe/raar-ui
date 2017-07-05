import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ISubscription } from 'rxjs/Subscription';
import { MainFormComponent } from '../../shared/components/main-form.component';
import { ShowsService } from '../services/shows.service';
import { ProfilesService } from '../../profiles/services/profiles.service';
import { ShowModel } from '../models/show.model';

@Component({
  moduleId: module.id,
  selector: 'sd-show-form',
  templateUrl: 'show-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowFormComponent extends MainFormComponent<ShowModel> {

  constructor(route: ActivatedRoute,
              router: Router,
              showsService: ShowsService,
              private profilesService: ProfilesService,
              changeDetector: ChangeDetectorRef,
              fb: FormBuilder) {
    super(route, router, showsService, changeDetector, fb);
  }

  reset() {
    this.form.reset({
      name: this.entry.attributes.name,
      details: this.entry.attributes.details,
      profile_id: this.entry.relationships.profile!.data.id
    });
  }

  protected serialize() {
    const formModel = this.form.value;
    this.entry.attributes.name = formModel.name
    this.entry.attributes.details = formModel.details;
    this.entry.relationships.profile = { data: { id: formModel.profile_id, type: 'profiles' } };
  }

  protected createForm(fb: FormBuilder) {
    this.form = fb.group({
      name: ['', Validators.required],
      details: '',
      profile_id: ''
    });
  }

  protected newEntry(): Observable<ShowModel> {
    const show = new ShowModel();
    const defaultProfile = this.profilesService.getDefaultEntry();
    if (defaultProfile) {
      show.relationships.profile = { data: { id: defaultProfile.id, type: 'profiles' } };
    }
    return Observable.of(show);
  }

  protected getRemoveQuestion(): string {
    return 'Willst du diese Sendung wirklich löschen?';
  }

  protected getTitleNew(): string {
    return 'Neue Sendung';
  }

  protected getMainRoute(): string {
    return 'shows';
  }

}
