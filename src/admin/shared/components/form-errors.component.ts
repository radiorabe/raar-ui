import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'sd-form-errors',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div *ngFor="let e of errors" class="alert alert-danger">
    {{ e }}
  </div>
  `
})
export class FormErrorsComponent {

  @Input() errors: string[];

  constructor() {}

}
