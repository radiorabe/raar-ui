import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { PlaybackFormatsService } from '../services/playback-formats.service';

@Component({
  moduleId: module.id,
  selector: 'sd-playback-formats',
  templateUrl: 'playback-formats.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaybackFormatsComponent {

  constructor(public playbackFormatsService: PlaybackFormatsService) {
    playbackFormatsService.reload();
  }

}
