import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { DowngradeActionModel } from '../models/downgrade-action.model';

@Component({
  moduleId: module.id,
  selector: 'sd-downgrade-action',
  templateUrl: 'downgrade-action.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DowngradeActionComponent {

  @Input() downgradeAction: DowngradeActionModel;

  @Output() edit = new EventEmitter<void>();

  @Output() remove = new EventEmitter<void>();

  constructor() { }

}
