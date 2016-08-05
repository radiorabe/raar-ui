import {Component, Input} from '@angular/core';
import {BroadcastModel, AudioFileModel} from '../../shared/models/index';
import {BroadcastTimePipe} from '../../shared/pipes/broadcast_time.pipe';
import {AudioFilesService} from '../../shared/services/index';
import {AudioPlayerService} from '../player/audio_player.service';


@Component({
  moduleId: module.id,
  selector: 'sd-broadcast',
  templateUrl: 'broadcast.html',
  providers: [],
  directives: [],
  pipes: [BroadcastTimePipe]
})
export class BroadcastComponent {

  @Input() broadcast: BroadcastModel;
  @Input() dateFormat: string;
  @Input() expanded: boolean;

  constructor(private audioFilesService: AudioFilesService,
              public audioPlayer: AudioPlayerService) { }

  toggle(e: Event) {
    this.expanded = !this.expanded;
    if (this.expanded)  {
      this.fetchAudioFiles();
    }
    e.preventDefault();
  }

  private fetchAudioFiles() {
    if (!this.broadcast.relationships.audio_files) {
      this.audioFilesService.getListForBroadcast(this.broadcast)
        .subscribe(list => {
          this.broadcast.relationships.audio_files = list.entries;
          for (const a of list.entries) a.relationships.broadcast = this.broadcast;
          return list;
        });
    }
  }

}
