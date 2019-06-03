import { EventEmitter, isDevMode } from "@angular/core";
import { AudioFileModel } from "../shared/models/audio-file.model";
import { PlayerEvents } from "./player-events";
import { Observable } from "rxjs";
import { BroadcastModel } from "../shared/models/broadcast.model";
import * as moment from "moment";

export class AudioPlayerService {
  private _audio: any;
  private _audioFile: AudioFileModel;
  private _volume: number = 100;
  private _events: EventEmitter<number> = new EventEmitter();

  get audioFile(): AudioFileModel {
    return this._audioFile;
  }

  play(audioFile?: AudioFileModel, time?: Date) {
    if (audioFile && audioFile !== this._audioFile) {
      this._audioFile = audioFile;
      if (this._audio) this._audio.destruct();
      const pos = time ? this.timeToPosition(time) : 0;
      this._audio = (<any>window).soundManager.createSound(
        this.getSoundOptions(audioFile.links.play, pos)
      );
    } else if (this._audio) {
      if (time) this.setPosition(time);
      if (!this.playing) this._audio.play();
    }
  }

  pause() {
    if (this._audio) {
      this._audio.pause();
    }
  }

  seek(percent: number) {
    if (this._audio) {
      var position = (this.duration * percent) / 100;
      this._audio.setPosition(position);
    }
  }

  setPosition(time: Date): void {
    if (this._audio) {
      this._audio.setPosition(this.timeToPosition(time));
    }
  }

  forward(seconds: number) {
    if (this._audio) {
      const position = this._audio.position + seconds * 1000;
      this._audio.setPosition(Math.min(position, this.duration));
    }
  }

  backward(seconds: number) {
    if (this._audio) {
      const position = this._audio.position - seconds * 1000;
      this._audio.setPosition(Math.max(position, 0));
    }
  }

  toggleMute() {
    if (this._audio) {
      this._audio.toggleMute();
    }
  }

  setVolume(vol: number) {
    this._volume = vol;
    if (this._audio) {
      this._audio.setVolume(vol);
    }
  }

  get playing(): boolean {
    return this._audio && this._audio.playState === 1 && !this._audio.paused;
  }

  get loading(): boolean {
    return this._audio && this._audio.readyState === 1;
  }

  get currentTime(): string {
    if (!this._audio) return "00:00";
    return this.durationAsString(this._audio.position);
  }

  get totalTime(): string {
    return this.durationAsString(this.duration);
  }

  get duration(): number {
    if (!this._audio) return 0;

    return (
      this._audio.duration ||
      this._audio.durationEstimate ||
      moment(this.broadcastAttrs.finished_at).diff(
        this.broadcastAttrs.started_at
      )
    );
  }

  get percent(): number {
    if (!this._audio) return 0;
    return Math.round((this._audio.position / this.duration) * 1000) / 10;
  }

  get position(): Date {
    if (!this._audio) return new Date(0);
    return new Date(
      this.broadcastAttrs.started_at.getTime() + this._audio.position
    );
  }

  get volume(): number {
    return this._volume;
  }

  get muted(): boolean {
    return !!this._audio && this._audio.muted;
  }

  get events(): Observable<number> {
    return this._events.asObservable();
  }

  private durationAsString(milis: number): string {
    let secs = Math.round(milis / 1000);
    let minutes = Math.floor(secs / 60);
    secs = secs % 60;
    let hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    if (hours > 0) {
      return `${hours}:${this.pad(minutes)}:${this.pad(secs)}`;
    } else {
      return `${this.pad(minutes)}:${this.pad(secs)}`;
    }
  }

  private pad(num: number): string {
    if (num < 10) return `0${num}`;
    return String(num);
  }

  private timeToPosition(time: Date): number {
    return time.getTime() - this.broadcastAttrs.started_at.getTime();
  }

  private get broadcastAttrs(): BroadcastModel["attributes"] {
    return this._audioFile.relationships.broadcast!.attributes;
  }

  private getSoundOptions(url: string | void, position: number): any {
    return {
      url: this.normalizeAudioUrl(url),
      volume: this._volume,
      position: position,
      autoLoad: true,
      autoPlay: true,
      onfinish: () => this._events.emit(PlayerEvents.Finish),
      onpause: () => this._events.emit(PlayerEvents.Pause),
      onplay: () => this._events.emit(PlayerEvents.Play),
      onresume: () => this._events.emit(PlayerEvents.PlayResume),
      onstop: () => this._events.emit(PlayerEvents.Stop)
      //onload: () => this._events.emit(PlayerEvents.BufferingStart),
      //onbufferchange: () => this._events.emit(PlayerEvents.BufferingStart),
      //ondataerror: () => this._events.emit(PlayerEvents.AudioError),
      //whileplaying: () => this._events.emit(PlayerEvents.Time)
    };
  }

  private normalizeAudioUrl(url: string | void): string {
    return (isDevMode() && url && !url.match(/^\/api/) ? "/api" : "") + url;
  }
}
