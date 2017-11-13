import { Component, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  moduleId: module.id,
  selector: 'sd-small-modal',
  templateUrl: 'small-modal.html',
})
export class SmallModalComponent {

  @Input() title: string;

  public visible = false;
  public visibleAnimate = false;

  constructor(private cd: ChangeDetectorRef) {}

  show(): void {
    this.visible = true;
    this.cd.markForCheck();
    setTimeout(() => {
      this.visibleAnimate = true;
      this.cd.markForCheck();
    }, 100);
  }

  hide(): void {
    this.visibleAnimate = false;
    this.cd.markForCheck();
    setTimeout(() => {
      this.visible = false;
      this.cd.markForCheck();
    }, 300);
  }

  onContainerClicked(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('modal')) {
      this.hide();
    }
  }

}
