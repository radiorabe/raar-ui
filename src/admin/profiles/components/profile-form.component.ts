import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ISubscription } from 'rxjs/Subscription';
import { MainFormComponent } from '../../shared/components/main-form.component';
import { ProfilesService } from '../services/profiles.service';
import { ArchiveFormatsRestService } from '../services/archive-formats-rest.service';
import { AudioEncodingsService } from '../../shared/services/audio-encodings.service';
import { ProfileModel } from '../models/profile.model';
import { ArchiveFormatModel } from '../models/archive-format.model';

@Component({
  moduleId: module.id,
  selector: 'sd-profile-form',
  templateUrl: 'profile-form.html',
  providers: [ArchiveFormatsRestService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileFormComponent extends MainFormComponent<ProfileModel> implements OnInit, OnDestroy {

  archiveFormats: ArchiveFormatModel[] = [];

  availableCodecs: string[] = [];

  constructor(route: ActivatedRoute,
              router: Router,
              profilesService: ProfilesService,
              public archiveFormatsRest: ArchiveFormatsRestService,
              private audioEncodingsService: AudioEncodingsService,
              changeDetector: ChangeDetectorRef,
              fb: FormBuilder) {
    super(route, router, profilesService, changeDetector, fb);
  }

  reset() {
    this.form.reset({
      name: this.entry.attributes.name,
      description: this.entry.attributes.description,
      default: { value: this.entry.attributes.default, disabled: this.entry.attributes.default }
    });
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

  protected setEntry(profile: ProfileModel) {
    super.setEntry(profile);

    if (profile.id) {
      this.archiveFormatsRest.profileId = profile.id;
      this.archiveFormatsRest.getList().subscribe(list => this.setArchiveFormats(list.entries));
    } else {
      this.setArchiveFormats([]);
    }
  }

  protected serialize() {
    const formModel = this.form.value;
    this.entry.attributes.name = formModel.name;
    this.entry.attributes.description = formModel.description;
    this.entry.attributes.default = formModel.default;
  }

  protected createForm(fb: FormBuilder) {
    this.form = fb.group({
      name: ['', Validators.required],
      description: '',
      default: ''
    });
  }

  protected newEntry(): Observable<ProfileModel> {
    const profile = new ProfileModel();
    return Observable.of(profile);
  }

  protected getRemoveQuestion(): string {
    return 'Willst du dieses Profil wirklich löschen?';
  }

  protected getTitleNew(): string {
    return 'Neues Profil';
  }

  protected getMainRoute(): string {
    return 'profiles';
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

}
