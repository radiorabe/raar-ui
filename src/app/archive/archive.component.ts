import {Component} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';


@Component({
  moduleId: module.id,
  selector: 'sd-archive',
  templateUrl: 'archive.html',
})
export class ArchiveComponent {

  private showNav: boolean = false;

  constructor(private router: Router) {
    router.events.subscribe(e => {
      if (e instanceof NavigationEnd) this.showNav = false
    });
  }

  toggleNav() {
    this.showNav = !this.showNav;
  }

}
