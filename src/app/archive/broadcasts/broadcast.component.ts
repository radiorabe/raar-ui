import {Component, Input} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {ISubscription} from 'rxjs/Subscription';
import {BroadcastModel, AudioFileModel} from '../../shared/models/index';
import {BroadcastTimePipe} from '../../shared/pipes/broadcast_time.pipe';
import {AudioFilesService} from '../../shared/services/index';
import {AudioPlayerService} from '../player/audio_player.service';


@Component({
  moduleId: module.id,
  selector: 'sd-broadcast',
  templateUrl: 'broadcast.html',
  providers: [],
  directives: [],
  pipes: [BroadcastTimePipe]
})
export class BroadcastComponent {

  @Input() broadcast: BroadcastModel;
  @Input() dateFormat: string;
  @Input() expanded: boolean;

  constructor(private audioFilesService: AudioFilesService,
              public audioPlayer: AudioPlayerService,
              private router: Router) {
  }

  ngOnInit() {
    if (this.expanded)  {
      this.fetchAudioFiles();
    }
  }

  toggle() {
    this.expanded = !this.expanded;
    if (this.expanded)  {
      this.fetchAudioFiles();
      this.navigateToSelf();
    }
  }

  get audioFiles(): AudioFileModel[] {
    return this.broadcast.relationships.audio_files;
  }

  private fetchAudioFiles() {
    if (!this.audioFiles) {
      this.audioFilesService.getListForBroadcast(this.broadcast)
        .subscribe(list => {
          this.broadcast.relationships.audio_files = list.entries;
          for (const a of list.entries) a.relationships.broadcast = this.broadcast;
        });
    }
  }

  private navigateToSelf() {
    const state = this.router.routerState;
    const dateRoute = state.firstChild(state.firstChild(state.root));
    if (dateRoute === null || dateRoute.snapshot.url[0].path == 'show') return;
    const date = this.broadcast.attributes.started_at;
    this.router.navigate([date.getFullYear(),
                          date.getMonth() + 1,
                          date.getDate(),
                          this.leftPad(date.getHours()) +
                          this.leftPad(date.getMinutes())])
  }

  private leftPad(number: number): string {
    let s = '0' + number;
    return s.substr(s.length-2);
  }

}
