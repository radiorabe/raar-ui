import { Component, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ISubscription } from 'rxjs/Subscription';


@Component({
  moduleId: module.id,
  selector: 'sd-layout',
  templateUrl: 'layout.html',
})
export class LayoutComponent implements OnDestroy {

  private _showNav: boolean = false;

  private routerSub: ISubscription;

  constructor(private router: Router) {
    this.routerSub = router.events.subscribe(e => {
      if (e instanceof NavigationEnd) this._showNav = false;
    });
  }

  get showNav(): boolean {
    return this._showNav;
  }

  toggleNav() {
    this._showNav = !this._showNav;
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
  }

}
