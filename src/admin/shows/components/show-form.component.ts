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
import { ProfilesService } from '../../profiles/services/profiles.service';
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
              private profilesService: ProfilesService,
              changeDetector: ChangeDetectorRef,
              fb: FormBuilder) {
    super(changeDetector);
    this.createForm(fb);
  }

  ngOnInit() {
    this.showSub = this.route.params
      .map(params => +params['id'])
      .distinctUntilChanged()
      .switchMap(id => {
        if (id > 0) {
          return this.showsService.getEntry(id).catch(err => this.newShow());
        } else {
          return this.newShow();
        }
      })
      .do(_ => window.scrollTo(0, 0))
      .subscribe(show => this.setShow(show));
  }

  ngOnDestroy() {
    this.showSub.unsubscribe();
  }

  onSubmit() {
    this.submitted = true;
    this.serialize();
    this.persist();
  }

  reset() {
    this.form.reset({
      name: this.show.attributes.name,
      details: this.show.attributes.details,
      profile_id: this.show.relationships.profile!.data.id
    });
  }

  remove(e: Event) {
    e.preventDefault();
    if (window.confirm('Willst du diese Sendung wirklich löschen?')) {
      this.submitted = true;
      this.showsService.removeEntry(this.show).subscribe(
        _ => this.router.navigate(['shows']),
        err => this.handleSubmitError(err)
      );
    }
  }

  private setShow(show: ShowModel) {
    this.show = show;
    this.title = show.id ? show.attributes.name : 'Neue Sendung';
    this.reset();
    this.changeDetector.markForCheck();
  }

  private serialize() {
    const formModel = this.form.value;
    this.show.attributes.name = formModel.name
    this.show.attributes.details = formModel.details;
    this.show.relationships.profile = { data: { id: formModel.profile_id, type: 'profiles' } };
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
    const defaultProfile = this.profilesService.getDefaultEntry();
    if (defaultProfile) {
      show.relationships.profile = { data: { id: defaultProfile.id, type: 'profiles' } };
    }
    return Observable.of(show);
  }

  private persist() {
    this.showsService.storeEntry(this.show).subscribe(
      show => {
        this.router.navigate(['shows', show.id]);
        this.setShow(show);
      },
      err => this.handleSubmitError(err));
  }
}
