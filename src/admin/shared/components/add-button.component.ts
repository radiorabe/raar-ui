import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'sd-add-button',
  templateUrl: 'add-button.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddButtonComponent {

  @Input() link: string[];

}
