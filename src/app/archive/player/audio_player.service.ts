import {AudioFileModel} from '../../shared/models/audio_file.model';

export class AudioPlayerService {

  private _audio: Audio = new Audio();
  private _audioFile: AudioFileModel;

  constructor() {  }

  get audioFile(): AudioFileModel {
    return this._audioFile;
  }

  play(audioFile?: AudioFileModel) {
    if (audioFile) {
      this._audioFile = audioFile;
      this._audio.src = audioFile.attributes.url;
      this._audio.load();
    }
    this._audio.play();
  }

  pause() {
    this._audio.pause();
  }

  playing(): boolean {
    return !this._audio.paused;
  }
}
