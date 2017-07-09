import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'sd-field-errors',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <span *ngFor="let e of errors" class="help text-danger">
    {{ e }}
  </span>
  `
})
export class FieldErrorsComponent {

  @Input() errors: string[];

}
