import { ViewportScroller } from "@angular/common";
import {
  Component,
  DOCUMENT,
  HostListener,
  OnDestroy,
  inject,
} from "@angular/core";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { Subscription } from "rxjs";
import { FooterComponent } from "./footer.component";

const TOGGLE_NAV_MAX_WIDTH = 767;

@Component({
  selector: "sd-layout",
  templateUrl: "layout.html",
  imports: [RouterOutlet, FooterComponent],
})
export class LayoutComponent implements OnDestroy {
  private document = inject(DOCUMENT);
  private viewportScroller = inject(ViewportScroller);

  private _togglableNav = false;
  private _showNav = false;

  private routerSub: Subscription;

  constructor() {
    this.resize(null);
    this.resetShowNav();

    const router = inject(Router);
    this.routerSub = router.events.subscribe((e) => {
      if (e instanceof NavigationEnd && !e.url.includes("/search/"))
        this.resetShowNav();
    });
  }

  get togglableNav(): boolean {
    return this._togglableNav;
  }

  get showNav(): boolean {
    return this._showNav;
  }

  @HostListener("window:resize", ["$event"])
  public resize(_event: Event): void {
    this._togglableNav = this.document.body.clientWidth <= TOGGLE_NAV_MAX_WIDTH;
  }

  scrollTo(anchor: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.resetShowNav();
    this.viewportScroller.scrollToAnchor(anchor);
  }

  toggleNav() {
    this._showNav = !this._showNav;
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
  }

  private resetShowNav() {
    this._showNav = !this._togglableNav;
  }
}
