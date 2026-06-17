import { Component, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "sd-footer",
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "footer.html",
})
export class FooterComponent {
  get currentYear(): number {
    return new Date().getFullYear();
  }
}
