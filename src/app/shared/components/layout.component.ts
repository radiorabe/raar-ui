import { Component, OnDestroy, Input, inject } from "@angular/core";
import { Router, NavigationEnd, RouterOutlet } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: "sd-layout",
  templateUrl: "layout.html",
  imports: [RouterOutlet],
})
export class LayoutComponent implements OnDestroy {
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

  toggleNav() {
    this._showNav = !this._showNav;
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
  }
}
