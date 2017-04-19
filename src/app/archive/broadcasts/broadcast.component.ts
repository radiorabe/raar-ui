import { Component, Input, OnInit, isDevMode } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BroadcastModel, AudioFileModel } from '../../shared/models/index';
import { AudioFilesService, AuthService, DateParamsService } from '../../shared/services/index';
import { AudioPlayerService } from '../player/audio_player.service';


@Component({
  moduleId: module.id,
  selector: 'sd-broadcast',
  templateUrl: 'broadcast.html',
})
export class BroadcastComponent implements OnInit {

  @Input() broadcast: BroadcastModel;
  @Input() dateFormat: string;
  @Input() expanded: boolean;
  @Input() view: string;

  loading: boolean = false;

  constructor(public audioPlayer: AudioPlayerService,
              public auth: AuthService,
              private audioFilesService: AudioFilesService,
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

  play(audio: AudioFileModel) {
    this.audioPlayer.play(audio);
    this.navigateToPlay(audio);
  }

  download(audio: AudioFileModel) {
    (<any>window).location =
      (isDevMode() ? '/api' : '') +
      audio.attributes.url +
      '?download=true&api_token=' +
       this.auth.apiToken;
  }

  get audioFiles(): AudioFileModel[] | void {
    return this.broadcast.relationships.audio_files;
  }

  private fetchAudioFiles() {
    if (!this.audioFiles) {
      this.loading = true;
      this.audioFilesService.getListForBroadcast(this.broadcast)
        .subscribe(list => {
          this.broadcast.relationships.audio_files = list.entries;
          for (const a of list.entries) a.relationships.broadcast = this.broadcast;
          this.loading = false;
        });
    }
  }

  private navigateToSelf(queryParams: any = {}) {
    if (!this.broadcastRoute) return;
    let url = this.broadcastRoute.snapshot.url.map(e => e.path);
    const date = this.broadcast.attributes.started_at;
    queryParams['time'] = DateParamsService.convertTimeToParam(date);
    if (url[0] === 'show') {
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
    return state.firstChild(state.firstChild(state.root));
  }

}
