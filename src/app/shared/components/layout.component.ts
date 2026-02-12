import { ViewportScroller } from "@angular/common";
import { Component, OnDestroy, inject } from "@angular/core";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: "sd-layout",
  templateUrl: "layout.html",
  imports: [RouterOutlet],
})
export class LayoutComponent implements OnDestroy {
  private viewportScroller = inject(ViewportScroller);

  private _showNav: boolean = false;

  private routerSub: Subscription;

  constructor() {
    const router = inject(Router);

    this.routerSub = router.events.subscribe((e) => {
      if (e instanceof NavigationEnd && !e.url.includes("/search/"))
        this._showNav = false;
    });
  }

  get showNav(): boolean {
    return this._showNav;
  }

  get currentYear(): number {
    return new Date().getFullYear();
  }

  scrollTo(anchor: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.viewportScroller.scrollToAnchor(anchor);
  }

  toggleNav() {
    this._showNav = !this._showNav;
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
  }
}
