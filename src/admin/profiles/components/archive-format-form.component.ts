import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatedFormComponent } from '../../shared/components/validated-form.component';
import { ArchiveFormatModel } from '../models/archive-format.model';
import { AudioEncodingModel } from '../../shared/models/audio-encoding.model';
import { DowngradeActionModel } from '../models/downgrade-action.model';
import { ArchiveFormatsRestService } from '../services/archive-formats-rest.service';
import { DowngradeActionsRestService } from '../services/downgrade-actions-rest.service';
import { AudioEncodingsService } from '../../shared/services/audio-encodings.service';

@Component({
  moduleId: module.id,
  selector: 'sd-archive-format-form',
  templateUrl: 'archive-format-form.html',
  providers: [DowngradeActionsRestService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArchiveFormatFormComponent extends ValidatedFormComponent implements OnInit {

  @Input() archiveFormat: ArchiveFormatModel;

  @Input() restService: ArchiveFormatsRestService;

  @Output() removed = new EventEmitter<void>();

  expanded: boolean = false;

  audioEncoding: AudioEncodingModel = new AudioEncodingModel();

  downgradeActions: DowngradeActionModel[] = [];

  editedDowngradeAction: DowngradeActionModel | void;

  constructor(public audioEncodingsService: AudioEncodingsService,
              public downgradeActionsRest: DowngradeActionsRestService,
              changeDetector: ChangeDetectorRef,
              fb: FormBuilder) {
    super(changeDetector);
    this.createForm(fb);
  }

  ngOnInit() {
    this.expanded = !this.archiveFormat.id;
    this.audioEncodingsService.getEntries().subscribe(list => {
      this.audioEncoding = list.find(e => e.attributes.codec === this.archiveFormat.attributes.codec) ||
                           new AudioEncodingModel();
      this.reset();
      this.changeDetector.markForCheck();
    });
    if (this.archiveFormat.id) {
      this.downgradeActionsRest.profileId = this.restService.profileId;
      this.downgradeActionsRest.archiveFormatId = this.archiveFormat.id;
      this.downgradeActionsRest.getList().subscribe(list => this.setDowngradeActions(list.entries));
    }
  }

  onSubmit() {
    this.submitted = true;
    this.serialize();
    this.persist();
  }

  reset() {
    this.form.reset({
      initial_bitrate: this.archiveFormat.attributes.initial_bitrate,
      initial_channels: this.archiveFormat.attributes.initial_channels,
      max_public_bitrate: this.archiveFormat.attributes.max_public_bitrate
    });
    if (!this.archiveFormat.id) {
      this.form.markAsDirty();
    }
  }

  remove(e: Event) {
    e.preventDefault();
    if (window.confirm('Willst du dieses Format wirklich löschen?')) {
      if (this.archiveFormat.id) {
        this.submitted = true;
        this.restService.remove(this.archiveFormat.id).subscribe(
          _ => this.removed.next(),
          err => this.handleSubmitError(err)
        );
      } else {
        this.removed.next();
      }
    }
  }

  addDowngradeAction(ereasing: boolean) {
    if (this.editedDowngradeAction) return;
    this.editedDowngradeAction = new DowngradeActionModel();
    this.editedDowngradeAction.ereasing = ereasing;
    if (ereasing) {
      this.editedDowngradeAction.attributes.bitrate = undefined;
      this.editedDowngradeAction.attributes.channels = undefined;
    }
  }

  editDowngradeAction(action: DowngradeActionModel) {
    if (this.editedDowngradeAction) return;
    this.editedDowngradeAction = action;
  }

  updateDowngradeAction(action: DowngradeActionModel) {
    const list = this.downgradeActions
      .filter(a => a.id !== action.id)
      .concat([action])
      .sort((a, b) => a.attributes.months - b.attributes.months);
    this.editedDowngradeAction = undefined;
    this.setDowngradeActions(list);
  }

  removeDowngradeAction(action: DowngradeActionModel) {
    if (this.editedDowngradeAction) return;
    if (window.confirm('Willst du diesen Schritt wirklich löschen?')) {
      if (action.id) {
        this.downgradeActionsRest.remove(action.id).subscribe(
          _ => {
            this.setDowngradeActions(this.downgradeActions.filter(a => a !== action));
          },
          err => this.handleSubmitError(err)
        );
      } else {
        this.setDowngradeActions(this.downgradeActions.filter(a => a !== action));
      }
    }
  }

  hasEreasingDowngrade(): boolean {
    return this.downgradeActions.some(a => a.ereasing);
  }

  private createForm(fb: FormBuilder) {
    this.form = fb.group({
      initial_bitrate: ['', Validators.required],
      initial_channels: ['', Validators.required],
      max_public_bitrate: ['', Validators.required]
    });
  }

  private serialize() {
    const formModel = this.form.value;
    this.archiveFormat.attributes.initial_bitrate = formModel.initial_bitrate;
    this.archiveFormat.attributes.initial_channels = formModel.initial_channels;
    this.archiveFormat.attributes.max_public_bitrate = formModel.max_public_bitrate;
  }

  private persist() {
    const action = this.archiveFormat.id ? 'update' : 'create';
    this.restService[action](this.archiveFormat).subscribe(
      _ => {
        this.expanded = true;
        this.reset();
        this.changeDetector.markForCheck();
      },
      err => this.handleSubmitError(err));
  }

  private setDowngradeActions(actions: DowngradeActionModel[]) {
    this.downgradeActions = actions;
    this.changeDetector.markForCheck();
  }
}
