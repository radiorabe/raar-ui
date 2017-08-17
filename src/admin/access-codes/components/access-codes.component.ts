import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { AccessCodesService } from '../services/access-codes.service';

@Component({
  moduleId: module.id,
  selector: 'sd-access-codes',
  templateUrl: 'access-codes.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccessCodesComponent {

  constructor(public accessCodesService: AccessCodesService) {
    accessCodesService.reload();
  }

}
