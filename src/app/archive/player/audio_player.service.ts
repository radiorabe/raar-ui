import {EventEmitter} from '@angular/core';
import {AudioFileModel} from '../../shared/models/audio_file.model';
import {PlayerEvents} from './player_events';

export class AudioPlayerService {

  private _audio: any;
  private _audioFile: AudioFileModel;
  private _events: EventEmitter<any> = new EventEmitter();

  constructor() {  }

  get audioFile(): AudioFileModel {
    return this._audioFile;
  }

  play(audioFile?: AudioFileModel, position?: Date) {
    if (audioFile) {
      this._audioFile = audioFile;
      if (this._audio) this._audio.destruct();
      const pos: number = position ?
        position.getTime() - this._audioFile.relationships.broadcast.attributes.started_at.getTime() :
        0;
      this._audio = (<any>window).soundManager.createSound({
        url: audioFile.attributes.url,
        volume: 100,
        position: pos,
        autoLoad: true,
        autoPlay: true,
        onbufferchange: () => this._events.emit(PlayerEvents.BufferingStart),
        ondataerror: () => this._events.emit(PlayerEvents.AudioError),
        onfinish: () => this._events.emit(PlayerEvents.Finish),
        onload: () => this._events.emit(PlayerEvents.BufferingStart),
        onpause: () => this._events.emit(PlayerEvents.Pause),
        onplay: () => this._events.emit(PlayerEvents.Play),
        onresume: () => this._events.emit(PlayerEvents.PlayResume),
        onstop: () => this._events.emit(PlayerEvents.Finish),
        whileplaying: () => this._events.emit(PlayerEvents.Time)
      });
    } else if (this._audio) {
      this._audio.play();
    }
  }

  pause() {
    if (this._audio) {
      this._audio.pause();
    }
  }

  seek(percent: number) {
    if (this._audio) {
      var time = this._audio.duration * percent / 100;
      this._audio.setPosition(time);
    }
  }

  toggleMute() {
    if (this._audio) {
      this._audio.toggleMute();
    }
  }

  setVolume(vol: number) {
    if (this._audio) {
      this._audio.setVolume(vol);
    }
  }

  get playing(): boolean {
    return this._audio && this._audio.playState == 1 && !this._audio.paused;
  }

  get currentTime(): string {
    if (!this._audio) return '00:00';
    return this.durationAsString(this._audio.position);
  }

  get totalTime(): string {
    return this.durationAsString(this.duration);
  }

  get duration(): number {
    if (!this._audio) return 0;
    return this._audio.duration == 0 ? this._audio.durationEstimate : this._audio.duration;
  }

  get percent(): number {
    if (!this._audio) return 0;
    return Math.round(this._audio.position / this.duration * 1000) / 10;
  }

  get muted(): boolean {
    return this._audio.muted;
  }

  private durationAsString(milis: number): string {
    let secs = Math.round(milis / 1000);
    let minutes = Math.floor(secs / 60);
    secs = secs % 60;
    let hours = Math.floor(minutes / 60)
    minutes = minutes % 60;
    if (hours > 0) {
      return hours + ":" + this.pad(minutes) + ":" + this.pad(secs);
    } else {
      return this.pad(minutes) + ":" + this.pad(secs);
    }
  }

  private pad(num: number): string {
    return ("0" + num).slice(-2);
  }
}
