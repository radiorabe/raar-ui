import {Component} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';


@Component({
  moduleId: module.id,
  selector: 'sd-archive',
  templateUrl: 'archive.html',
})
export class ArchiveComponent {

  private _showNav: boolean = false;

  constructor(private router: Router) {
    router.events.subscribe(e => {
      if (e instanceof NavigationEnd) this._showNav = false
    });
  }

  get showNav(): boolean {
    return this._showNav;
  }

  toggleNav() {
    this._showNav = !this._showNav;
  }

}
