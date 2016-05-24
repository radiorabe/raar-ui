import {Component} from '@angular/core';
import {AudioPlayerService} from './audio_player.service';
import {BroadcastTimePipe} from '../../shared/pipes/broadcast_time.pipe';


@Component({
  moduleId: module.id,
  selector: 'sd-player',
  templateUrl: 'player.html',
  providers: [],
  directives: [],
  pipes: [BroadcastTimePipe]
})
export class PlayerComponent {

  constructor(private player: AudioPlayerService) {}

  togglePlay() {
    if (!this.player.audioFile) return;
    if (this.player.playing()) {
      this.player.pause();
    } else {
      this.player.play();
    }
  }
}
