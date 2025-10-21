import { Component, Input, ChangeDetectorRef, inject } from "@angular/core";
import { NgStyle } from "@angular/common";

@Component({
  selector: "sd-small-modal",
  templateUrl: "small-modal.html",
  imports: [NgStyle],
})
export class SmallModalComponent {
  private cd = inject(ChangeDetectorRef);

  @Input() title: string;

  visible = false;
  visibleAnimate = false;

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
    if ((<HTMLElement>event.target).classList.contains("modal")) {
      this.hide();
    }
  }
}
