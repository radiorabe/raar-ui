import { Component, OnInit } from '@angular/core';
import { Params } from '@angular/router';
import { ISubscription } from 'rxjs/Subscription';
import { AudioPlayerService } from './audio_player.service';
import { BroadcastsService } from '../../shared/services/index';
import { AudioFileModel, BroadcastModel } from '../../shared/models/index';
import { AudioFilesService } from '../shared/services/audio_files.service';
import { DateParamsService } from '../../shared/services/date_params.service';

@Component({
  moduleId: module.id,
  selector: 'sd-player',
  templateUrl: 'player.html'
})
export class PlayerComponent implements OnInit {

  constructor(private _player: AudioPlayerService,
              private audioFilesService: AudioFilesService,
              private broadcastsService: BroadcastsService) {}

  ngOnInit() {
    this.handleRouteParams(this.parsePlayerRouteParams());
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

  private parsePlayerRouteParams(): { [key: string]: any } {
    const params: Params = {};
    const exp = /(\w+)=(\w+)/g;
    const path = window.location.pathname;
    let match = exp.exec(path);
    while(match !== null) {
      params[match[1]] = match[2];
      match = exp.exec(path);
    }
    return params;
  }

  private handleRouteParams(params: Params): void {
    if (params['time'] && params['play'] && params['format']) {
      const time = DateParamsService.timeFromParams(params);
      this.broadcastsService.getForTime(time).subscribe(broadcast => {
        if (broadcast) {
          this.findAndPlayAudio(broadcast, params, time);
        }
      });
    }
  }

  private findAndPlayAudio(broadcast: BroadcastModel, params: Params, time: Date): void {
    this.audioFilesService.getListForBroadcast(broadcast).subscribe(files => {
      let audio = files.entries.find(file => {
        return file.attributes.playback_format === params['play'] &&
          file.attributes.codec === params['format'];
      });
      if (!audio) audio = files.entries[0];
      if (audio) {
        this.player.play(audio, time);
      }
    });
  }

}
