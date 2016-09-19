import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, NavigationEnd} from '@angular/router';
import {BroadcastsService, AudioFilesService, DateParamsService} from '../shared/services/index';
import {AudioPlayerService} from './player/audio_player.service';
import {DatepickerComponent} from './datepicker/datepicker.component';
import {ShowsComponent} from './shows/shows.component';
import {BroadcastsShowComponent} from './broadcasts/broadcasts_show.component';
import {BroadcastsDateComponent} from './broadcasts/broadcasts_date.component';
import {PlayerComponent} from './player/player.component';

@Component({
  moduleId: module.id,
  selector: 'sd-archive',
  templateUrl: 'archive.html',
  providers: [BroadcastsService, AudioFilesService, AudioPlayerService],
  directives: [ROUTER_DIRECTIVES, DatepickerComponent, ShowsComponent, BroadcastsShowComponent,
              BroadcastsDateComponent, PlayerComponent]
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
