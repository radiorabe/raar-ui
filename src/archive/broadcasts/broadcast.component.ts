import { Component, Input, OnChanges, isDevMode } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BroadcastModel, AudioFileModel } from '../../shared/models/index';
import { LoginWindowService } from '../shared/services/login-window.service';
import { AudioPlayerService } from '../player/audio_player.service';
import { AudioFilesService } from '../shared/services/audio_files.service';
import { DateParamsService } from '../../shared/services/date_params.service';


@Component({
  moduleId: module.id,
  selector: 'sd-broadcast',
  templateUrl: 'broadcast.html',
})
export class BroadcastComponent implements OnChanges {

  @Input() broadcast: BroadcastModel;
  @Input() dateFormat: string;
  @Input() expanded: boolean;
  @Input() view: 'month' | 'day';

  loading: boolean = false;

  constructor(public audioPlayer: AudioPlayerService,
              public loginWindow: LoginWindowService,
              private audioFilesService: AudioFilesService,
              private router: Router) {
  }

  ngOnChanges(changes: any) {
    if (changes.broadcast && this.expanded) {
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

  play(audio: AudioFileModel) {
    this.audioPlayer.play(audio);
    this.navigateToPlay(audio);
  }

  download(audio: AudioFileModel) {
    (<any>window).location = (isDevMode() ? '/api' : '') + audio.links.download;
  }

  get audioFiles(): AudioFileModel[] | void {
    return this.broadcast.relationships.audio_files;
  }

  private fetchAudioFiles() {
    if (!this.audioFiles && this.broadcast.attributes.audio_access) {
      this.loading = true;
      this.audioFilesService.getListForBroadcast(this.broadcast)
        .subscribe(list => {
          this.broadcast.relationships.audio_files = list.entries;
          this.loading = false;
        });
    }
  }

  private navigateToSelf(queryParams: any = {}) {
    if (!this.broadcastRoute) return;
    let url = this.broadcastRoute.snapshot.url.map(e => e.path);
    const date = this.broadcast.attributes.started_at;
    queryParams['time'] = DateParamsService.convertTimeToParam(date);
    if (url[0] === 'show' || url[0] === 'search') {
      queryParams['year'] = date.getFullYear();
      queryParams['month'] = date.getMonth() + 1;
      queryParams['day'] = date.getDate();
    } else if (url[url.length - 1] !== date.getDate().toString()) {
      // handle shows that begin before midnight and go on to the current day.
      queryParams['time'] = '0000';
    }
    this.router.navigate([...url, queryParams]);
  }

  private navigateToPlay(audio: AudioFileModel) {
    this.navigateToSelf({ play: audio.attributes.playback_format,
                          format: audio.attributes.codec });
  }

  private get broadcastRoute(): ActivatedRoute {
    var state = <any>this.router.routerState;
    return state.firstChild(state.root);
  }

}
