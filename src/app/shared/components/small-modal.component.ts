import { NgStyle } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  Input,
  ViewChild,
} from "@angular/core";

@Component({
  selector: "sd-small-modal",
  templateUrl: "small-modal.html",
  imports: [NgStyle],
})
export class SmallModalComponent {
  private cd = inject(ChangeDetectorRef);

  @Input() heading: string;

  @ViewChild("dialog") dialog: ElementRef;

  visible = false;
  visibleAnimate = false;

  show(): void {
    this.visible = true;
    this.cd.markForCheck();

    setTimeout(() => {
      this.visibleAnimate = true;
      this.dialog.nativeElement.focus();
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
