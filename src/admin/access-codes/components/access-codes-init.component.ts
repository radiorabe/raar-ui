import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { AccessCodesService } from '../services/access-codes.service';

@Component({
  moduleId: module.id,
  selector: 'sd-access-codes-init',
  templateUrl: 'access-codes-init.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccessCodesInitComponent {

  constructor(public accessCodesService: AccessCodesService) {
  }

}
