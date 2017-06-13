import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'sd-field-errors',
  template: `
  <span *ngFor="let e of errors" class="help text-danger">
    {{ e }}
  </span>
  `
})
export class FieldErrorsComponent {

  @Input() errors: string[];

  constructor() {}

}
