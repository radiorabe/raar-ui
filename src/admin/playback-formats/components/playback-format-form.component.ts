import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ISubscription } from 'rxjs/Subscription';
import { MainFormComponent } from '../../shared/components/main-form.component';
import { PlaybackFormatsService } from '../services/playback-formats.service';
import { ProfilesService } from '../../profiles/services/profiles.service';
import { PlaybackFormatModel } from '../models/playback-format.model';
import { AudioEncodingsService } from '../../shared/services/audio-encodings.service';
import { AudioEncodingModel } from '../../shared/models/audio-encoding.model';

@Component({
  moduleId: module.id,
  selector: 'sd-playback-format-form',
  templateUrl: 'playback-format-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaybackFormatFormComponent extends MainFormComponent<PlaybackFormatModel> {

  audioEncoding: AudioEncodingModel | void;

  constructor(route: ActivatedRoute,
              router: Router,
              playbackFormatsService: PlaybackFormatsService,
              public audioEncodingsService: AudioEncodingsService,
              changeDetector: ChangeDetectorRef,
              fb: FormBuilder) {
    super(route, router, playbackFormatsService, changeDetector, fb);
  }

  reset() {
    this.form.reset({
      name: this.entry.attributes.name,
      description: this.entry.attributes.description,
      codec: this.entry.attributes.codec,
      bitrate: this.entry.attributes.bitrate,
      channels: this.entry.attributes.channels
    });
  }

  protected serialize() {
    const formModel = this.form.value;
    this.entry.attributes.name = formModel.name;
    this.entry.attributes.description = formModel.description;
    this.entry.attributes.codec = formModel.codec;
    this.entry.attributes.bitrate = formModel.bitrate;
    this.entry.attributes.channels = formModel.channels;
  }

  protected createForm(fb: FormBuilder) {
    this.form = fb.group({
      name: ['', Validators.required],
      description: '',
      codec: ['', Validators.required],
      bitrate: ['', Validators.required],
      channels: ['', Validators.required]
    });
    this.form.controls['codec'].valueChanges.subscribe(value => {
      this.audioEncodingsService.getEntries().subscribe(encodings => {
        this.audioEncoding = encodings.find(e => e.attributes.codec === value);
      });
    });
  }

  protected newEntry(): Observable<PlaybackFormatModel> {
    const format = new PlaybackFormatModel();
    return Observable.of(format);
  }

  protected getRemoveQuestion(): string {
    return 'Willst du dieses Wiedergabeformat wirklich löschen?';
  }

  protected getTitleNew(): string {
    return 'Neues Wiedergabeformat';
  }

  protected getMainRoute(): string {
    return 'playback_formats';
  }

}
