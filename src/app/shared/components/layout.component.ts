import { Component, OnDestroy, Input } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: "sd-layout",
  templateUrl: "layout.html",
})
export class LayoutComponent implements OnDestroy {
  @Input() collapsibleNav = true;

  private _showNav: boolean = false;

  private routerSub: Subscription;

  constructor(router: Router) {
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

  toggleNav() {
    this._showNav = !this._showNav;
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
  }
}
