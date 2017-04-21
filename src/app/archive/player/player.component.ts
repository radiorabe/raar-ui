import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ISubscription } from 'rxjs/Subscription';
import { AudioPlayerService } from './audio_player.service';
import { AudioFilesService, BroadcastsService, DateParamsService } from '../../shared/services/index';
import { AudioFileModel, BroadcastModel } from '../../shared/models/index';

@Component({
  moduleId: module.id,
  selector: 'sd-player',
  templateUrl: 'player.html'
})
export class PlayerComponent implements OnInit {

  private paramsSub: ISubscription;

  constructor(private _player: AudioPlayerService,
              private audioFilesService: AudioFilesService,
              private broadcastsService: BroadcastsService,
              private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit() {
    const state = <any>this.router.routerState;
    const broadcastRoute = state.firstChild(state.firstChild(state.root));
    if (!broadcastRoute) return;
    this.paramsSub = broadcastRoute.params
      .distinctUntilChanged()
      .subscribe((params: any) => this.handleRouteParams(params));
  }

  ngDestroy() {
    if (this.paramsSub) {
      this.paramsSub.unsubscribe();
    }
  }

  get player(): AudioPlayerService {
    return this._player;
  }

  get audioFile(): AudioFileModel {
    return this.player.audioFile;
  }

  get broadcast(): BroadcastModel | void {
    if (!this.audioFile) return;
    return this.audioFile.relationships.broadcast;
  }

  get volume(): number {
    return this.player.muted ? 0 : this.player.volume;
  }

  get highVolume(): boolean {
    return !this.player.muted && this.player.volume >= 40;
  }

  get lowVolume(): boolean {
    return !this.player.muted && this.player.volume < 40 && this.player.volume > 0;
  }

  get mute(): boolean {
    return this.player.muted || this.player.volume === 0;
  }

  togglePlay() {
    if (!this.player.audioFile) return;
    if (this.player.playing) {
      this.player.pause();
    } else {
      this.player.play();
    }
  }

  private handleRouteParams(params: { [key: string]: any }) {
    if (params['time'] && params['play'] && params['format']) {
      const time = DateParamsService.timeFromParams(params);
      if (!this.isCurrentBroadcast(time)) {
        this.broadcastsService.getForTime(time).subscribe(broadcast => {
          if (broadcast) {
            const audio = this.buildAudioFile(broadcast, time, params['play'], params['format']);
            this.player.play(audio, time);
          }
        });
      }
    }
  }

  private isCurrentBroadcast(date: Date): boolean {
    return this.broadcast ?
        this.broadcast.attributes.started_at <= date &&
        this.broadcast.attributes.finished_at > date : false;
  }

  private buildAudioFile(broadcast: BroadcastModel,
                         time: Date,
                         playbackFormat: string,
                         codec: string): AudioFileModel {
    const model = new AudioFileModel();
    model.attributes.codec = codec;
    model.attributes.playback_format = playbackFormat;
    model.links.play = this.audioFilesService.buildUrl(time, playbackFormat, codec);
    model.relationships.broadcast = broadcast;
    return model;
  }

}
