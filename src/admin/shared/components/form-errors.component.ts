import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'sd-form-errors',
  template: `
  <div *ngFor="let e of errors" class="notification is-danger">
    {{ e }}
  </div>
  `
})
export class FormErrorsComponent {

  @Input() errors: string[];

  constructor() {}

}
