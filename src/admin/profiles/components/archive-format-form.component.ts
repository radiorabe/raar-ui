import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ISubscription } from 'rxjs/Subscription';
import { ValidatedFormComponent } from '../../shared/components/validated-form.component';
import { ProfilesService } from '../services/profiles.service';
import { ProfileModel } from '../models/profile.model';
import { ArchiveFormatModel } from '../models/archive-format.model';
import { AudioEncodingModel } from '../models/audio-encoding.model';
import { ArchiveFormatsRestService } from '../services/archive-formats-rest.service';
import { AudioEncodingsService } from '../services/audio-encodings.service';

@Component({
  moduleId: module.id,
  selector: 'sd-archive-format-form',
  templateUrl: 'archive-format-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArchiveFormatFormComponent extends ValidatedFormComponent implements OnInit {

  @Input() archiveFormat: ArchiveFormatModel;

  @Input() restService: ArchiveFormatsRestService;

  audioEncoding: AudioEncodingModel = new AudioEncodingModel();

  constructor(public audioEncodingsService: AudioEncodingsService,
              changeDetector: ChangeDetectorRef,
              fb: FormBuilder) {
    super(changeDetector);
    this.createForm(fb);
  }

  ngOnInit() {
    this.reset();
  }

  onSubmit() {
    this.submitted = true;
    this.serializeArchiveFormat();
    this.saveArchiveFormat();
  }

  reset() {
    this.form.reset({
      codec: this.archiveFormat.attributes.codec,
      initial_bitrate: this.archiveFormat.attributes.initial_bitrate,
      initial_channels: this.archiveFormat.attributes.initial_channels,
      max_public_bitrate: this.archiveFormat.attributes.max_public_bitrate
    });
  }

  remove(e: Event) {
    e.preventDefault();
    if (window.confirm('Willst du dieses Profil wirklich löschen?')) {
      this.submitted = true;
      this.restService.remove(this.archiveFormat.id).subscribe(
        _ => undefined,
        err => this.handleSubmitError(err)
      );
    }
  }

  private createForm(fb: FormBuilder) {
    this.form = fb.group({
      codec: ['', Validators.required],
      initial_bitrate: ['', Validators.required],
      initial_channels: ['', Validators.required],
      max_public_bitrate: ['', Validators.required]
    });

    this.form.controls['codec'].valueChanges.subscribe((value) => {
      this.audioEncodingsService.getEntries().subscribe(list => {
        this.audioEncoding = list.find(e => e.id === value) || new AudioEncodingModel();
        this.changeDetector.markForCheck();
      });
    });
  }

  private serializeArchiveFormat() {
    const formModel = this.form.value;
    this.archiveFormat.attributes.codec = formModel.codec
    this.archiveFormat.attributes.initial_bitrate = formModel.initial_bitrate;
    this.archiveFormat.attributes.initial_channels = formModel.initial_channels;
    this.archiveFormat.attributes.max_public_bitrate = formModel.max_public_bitrate;
  }

  private newArchiveFormat(): Observable<ArchiveFormatModel> {
    const format = new ArchiveFormatModel();
    return Observable.of(format);
  }

  private saveArchiveFormat() {
    const action = this.archiveFormat.id ? 'update' : 'create';
    this.restService[action](this.archiveFormat).subscribe(
      _ => this.reset(),
      err => this.handleSubmitError(err));
  }
}
