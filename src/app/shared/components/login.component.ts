import {Component, ViewChild} from '@angular/core';
import {SmallModalComponent} from './small-modal.component'

@Component({
  moduleId: module.id,
  selector: 'sd-login',
  templateUrl: 'login.html',
})
export class LoginComponent {

  @ViewChild('modal') public modal: SmallModalComponent;

  show() {
    this.modal.show();
  }

}
