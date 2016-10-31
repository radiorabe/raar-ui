import {Component, Input} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {ISubscription} from 'rxjs/Subscription';
import {BroadcastModel, AudioFileModel} from '../../shared/models/index';
import {AudioFilesService, DateParamsService} from '../../shared/services/index';
import {AudioPlayerService} from '../player/audio_player.service';


@Component({
  moduleId: module.id,
  selector: 'sd-broadcast',
  templateUrl: 'broadcast.html',
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

  play(audio: AudioFileModel) {
    this.audioPlayer.play(audio);
    this.navigateToPlay(audio);
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

  private navigateToSelf(queryParams: any = {}) {
    if (!this.broadcastRoute) return;
    const url = this.broadcastRoute.snapshot.url.map(e => e.path);
    console.log(url);
    const date = this.broadcast.attributes.started_at;
    queryParams['time'] = DateParamsService.convertTimeToParam(date);
    if (url[0] === 'show') {
      queryParams['year'] = date.getFullYear();
      queryParams['month'] = date.getMonth() + 1;
      queryParams['day'] = date.getDate();
    } else if (url[url.length - 1] != date.getDate().toString()) {
      // handle shows that begin before midnight and go on to the current day.
      queryParams['time'] = '0000';
    }
    this.router.navigate([...url, queryParams])
  }

  private navigateToPlay(audio: AudioFileModel) {
    this.navigateToSelf({ play: audio.attributes.playback_format,
                          format: audio.attributes.codec });
  }

  private get broadcastRoute(): ActivatedRoute {
    var state = this.router.routerState;
    return state.firstChild(state.firstChild(state.root));
  }

}
