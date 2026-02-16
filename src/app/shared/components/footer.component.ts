import { Component } from "@angular/core";

@Component({
  selector: "sd-footer",
  templateUrl: "footer.html",
})
export class FooterComponent {
  get currentYear(): number {
    return new Date().getFullYear();
  }
}
