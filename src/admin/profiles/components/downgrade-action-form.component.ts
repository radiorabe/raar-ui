import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatedFormComponent } from '../../shared/components/validated-form.component';
import { DowngradeActionModel } from '../models/downgrade-action.model';
import { AudioEncodingModel } from '../../shared/models/audio-encoding.model';
import { DowngradeActionsRestService } from '../services/downgrade-actions-rest.service';

@Component({
  moduleId: module.id,
  selector: 'sd-downgrade-action-form',
  templateUrl: 'downgrade-action-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DowngradeActionFormComponent extends ValidatedFormComponent implements OnInit {

  @Input() downgradeAction: DowngradeActionModel;

  @Input() restService: DowngradeActionsRestService;

  @Input() audioEncoding: AudioEncodingModel;

  @Output() saved = new EventEmitter<DowngradeActionModel>();

  @Output() canceled = new EventEmitter<void>();

  constructor(changeDetector: ChangeDetectorRef,
              fb: FormBuilder) {
    super(changeDetector);
    this.createForm(fb);
  }

  ngOnInit() {
    this.reset();
  }

  onSubmit() {
    this.submitted = true;
    this.serialize();
    this.persist();
  }

  cancel() {
    this.canceled.next();
  }

  reset() {
    this.form.reset({
      months: this.downgradeAction.attributes.months,
      bitrate: this.downgradeAction.attributes.bitrate,
      channels: this.downgradeAction.attributes.channels
    });
    if (!this.downgradeAction.id) {
      this.form.markAsDirty();
    }
  }

  private createForm(fb: FormBuilder) {
    this.form = fb.group({
      months: ['', Validators.required],
      bitrate: [''],
      channels: ['']
    });
  }

  private serialize() {
    const formModel = this.form.value;
    this.downgradeAction.attributes.months = formModel.months;
    this.downgradeAction.attributes.bitrate = formModel.bitrate;
    this.downgradeAction.attributes.channels = formModel.channels;
  }

  private persist() {
    const action = this.downgradeAction.id ? 'update' : 'create';
    this.restService[action](this.downgradeAction, new DowngradeActionModel()).subscribe(
      action => this.saved.next(action),
      err => this.handleSubmitError(err));
  }
}
