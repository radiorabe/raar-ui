import { Component, OnInit, OnDestroy, inject } from "@angular/core";
import { Params } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil, filter } from "rxjs/operators";
import { AudioPlayerService } from "./audio-player.service";
import { BroadcastsService } from "../shared/services/broadcasts.service";
import { AudioFileModel, BroadcastModel } from "../shared/models/index";
import { AudioFilesService } from "../shared/services/audio-files.service";
import { DateParamsService } from "../shared/services/date-params.service";
import { PlayerEvents } from "./player-events";
import { SliderComponent } from "../shared/components/slider.component";
import { BroadcastTimePipe } from "../shared/pipes/broadcast-time.pipe";

@Component({
  selector: "sd-player",
  templateUrl: "player.html",
  imports: [SliderComponent, BroadcastTimePipe],
})
export class PlayerComponent implements OnInit, OnDestroy {
  private _player = inject(AudioPlayerService);
  private audioFilesService = inject(AudioFilesService);
  private broadcastsService = inject(BroadcastsService);

  private readonly destroy$ = new Subject<void>();

  ngOnInit() {
    this.handleRouteParams(this.parseRouteParams());
    this._player.events
      .pipe(
        takeUntil(this.destroy$),
        filter((i) => i === PlayerEvents.Finish),
      )
      .subscribe(() => this.playNextBroadcast());
  }

  ngOnDestroy() {
    this.destroy$.next();
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
    return (
      !this.player.muted && this.player.volume < 40 && this.player.volume > 0
    );
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

  private playNextBroadcast(): void {
    if (this.broadcast) {
      this.findAndPlayBroadcast(
        this.broadcast.attributes.finished_at,
        this.audioFile.attributes.codec,
        this.audioFile.attributes.playback_format,
      );
    }
  }

  private parseRouteParams(): Params {
    const params: Params = {};
    this.parsePlayerRouteParams(params);
    this.parseDateRouteParams(params);
    return params;
  }

  private parsePlayerRouteParams(params: Params): void {
    const exp = /(\w+)=(\w+)/g;
    const path = window.location.pathname;
    let match = exp.exec(path);
    while (match !== null) {
      params[match[1]] = match[2];
      match = exp.exec(path);
    }
  }

  private parseDateRouteParams(params: Params): void {
    // for date views, eg /2017/06/23
    const match = window.location.pathname.match(/^\/(\d+)\/(\d+)\/(\d+);/);
    if (match) {
      params["year"] = match[1];
      params["month"] = match[2];
      params["day"] = match[3];
    }
  }

  private handleRouteParams(params: Params): void {
    if (params["time"] && params["play"] && params["format"]) {
      const time = DateParamsService.timeFromParams(params);
      // Most browser prevent autoplay on load. Do not even try
      // so the play button is displayed correctly.
      this.findAndPlayBroadcast(time, params["format"], params["play"], false);
    }
  }

  private findAndPlayBroadcast(
    time: Date,
    codec: string,
    playbackFormat: string,
    autoplay: boolean = true,
  ): void {
    this.broadcastsService
      .getForTime(time)
      .pipe(filter(Boolean))
      .subscribe((broadcast: BroadcastModel) => {
        this.findAndPlayAudio(broadcast, time, codec, playbackFormat, autoplay);
      });
  }

  private findAndPlayAudio(
    broadcast: BroadcastModel,
    time: Date,
    codec: string,
    playbackFormat: string,
    autoplay: boolean = true,
  ): void {
    this.audioFilesService.getListForBroadcast(broadcast).subscribe((files) => {
      let audio = files.entries.find((file) => {
        return (
          file.attributes.playback_format === playbackFormat &&
          file.attributes.codec === codec
        );
      });
      if (!audio) audio = files.entries[0];
      if (audio) this.player.play(audio, time, autoplay);
    });
  }
}
