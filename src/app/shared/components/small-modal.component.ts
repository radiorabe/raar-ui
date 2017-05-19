import { Component, Input, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  moduleId: module.id,
  selector: 'sd-small-modal',
  templateUrl: 'small-modal.html',
})
export class SmallModalComponent {

  @Input() title: string;

  @ViewChild('modal') public modal: ModalDirective;

  show() {
    this.modal.show();
  }

  hide() {
    this.modal.hide();
  }

}
