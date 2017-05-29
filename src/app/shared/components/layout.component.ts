import { Component, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ISubscription } from 'rxjs/Subscription';
import { AuthService } from '../services/auth.service';
import { LoginWindowService } from '../services/login-window.service';


@Component({
  moduleId: module.id,
  selector: 'sd-layout',
  templateUrl: 'layout.html',
})
export class LayoutComponent implements OnDestroy {

  private _showNav: boolean = false;

  private routerSub: ISubscription;

  constructor(private router: Router,
              public auth: AuthService,
              private loginWindow: LoginWindowService) {
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

  showLogin() {
    this.loginWindow.show();
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
  }

}
