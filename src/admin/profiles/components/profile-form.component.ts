import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ISubscription } from 'rxjs/Subscription';
import { ValidatedFormComponent } from '../../shared/components/validated-form.component';
import { ProfilesService } from '../services/profiles.service';
import { ArchiveFormatsRestService } from '../services/archive-formats-rest.service';
import { AudioEncodingsService } from '../services/audio-encodings.service';
import { ProfileModel } from '../models/profile.model';
import { ArchiveFormatModel } from '../models/archive-format.model';

@Component({
  moduleId: module.id,
  selector: 'sd-profile-form',
  templateUrl: 'profile-form.html',
  providers: [ArchiveFormatsRestService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileFormComponent extends ValidatedFormComponent implements OnInit, OnDestroy {

  profile: ProfileModel;

  title: string;

  archiveFormats: ArchiveFormatModel[] = [];

  availableCodecs: string[] = [];

  private profileSub: ISubscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private profilesService: ProfilesService,
              public archiveFormatsRest: ArchiveFormatsRestService,
              private audioEncodingsService: AudioEncodingsService,
              changeDetector: ChangeDetectorRef,
              fb: FormBuilder) {
    super(changeDetector);
    this.createForm(fb);
  }

  ngOnInit() {
    this.profileSub = this.route.params
      .map(params => +params['id'])
      .distinctUntilChanged()
      .switchMap(id => {
        if (id > 0) {
          return this.profilesService.getEntry(id).catch(err => this.newProfile());
        } else {
          return this.newProfile();
        }
      })
      .do(_ => window.scrollTo(0, 0))
      .subscribe(profile => this.setProfile(profile));
  }

  ngOnDestroy() {
    this.profileSub.unsubscribe();
  }

  onSubmit() {
    this.submitted = true;
    this.serializeProfile();
    this.saveProfile();
  }

  reset() {
    this.form.reset({
      name: this.profile.attributes.name,
      description: this.profile.attributes.description,
      default: { value: this.profile.attributes.default, disabled: this.profile.attributes.default }
    });
  }

  remove(e: Event) {
    e.preventDefault();
    if (window.confirm('Willst du dieses Profil wirklich löschen?')) {
      this.submitted = true;
      this.profilesService.removeEntry(this.profile).subscribe(
        _ => this.router.navigate(['profiles']),
        err => this.handleSubmitError(err)
      );
    }
  }

  addArchiveFormat(codec: string) {
    const newFormat = new ArchiveFormatModel();
    newFormat.attributes.codec = codec;
    this.setArchiveFormats(this.archiveFormats.concat([newFormat]));
  }

  removeArchiveFormat(format: ArchiveFormatModel) {
    this.setArchiveFormats(
      this.archiveFormats.filter(f => f.attributes.codec !== format.attributes.codec));
  }

  private setProfile(profile: ProfileModel) {
    this.profile = profile;
    this.title = profile.id ? profile.toString() : 'Neues Profil';
    this.reset();
    if (profile.id) {
      this.archiveFormatsRest.profileId = profile.id;
      this.archiveFormatsRest.getList().subscribe(list => this.setArchiveFormats(list.entries));
    } else {
      this.setArchiveFormats([]);
    }
    this.changeDetector.markForCheck();
  }

  private setArchiveFormats(formats: ArchiveFormatModel[]) {
    this.audioEncodingsService.getEntries().subscribe(encodings => {
      this.archiveFormats = formats;
      this.availableCodecs = encodings
        .map(e => e.attributes.codec)
        .filter(codec => !formats.find(f => f.attributes.codec === codec));
      this.changeDetector.markForCheck();
    });
  }

  private serializeProfile() {
    const formModel = this.form.value;
    this.profile.attributes.name = formModel.name
    this.profile.attributes.description = formModel.description;
    this.profile.attributes.default = formModel.default;
  }

  private createForm(fb: FormBuilder) {
    this.form = fb.group({
      name: ['', Validators.required],
      description: '',
      default: ''
    });
  }

  private newProfile(): Observable<ProfileModel> {
    const profile = new ProfileModel();
    return Observable.of(profile);
  }

  private saveProfile() {
    this.profilesService.storeEntry(this.profile).subscribe(
      profile => {
        this.router.navigate(['profiles', profile.id]);
        this.setProfile(profile);
      },
      err => this.handleSubmitError(err));
  }
}
