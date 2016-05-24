import {Component, Input} from '@angular/core';
import {BroadcastModel, AudioFileModel} from '../../shared/models/index';
import {BroadcastTimePipe} from '../../shared/pipes/broadcast_time.pipe';
import {ArchiveService} from '../archive.service';


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

  constructor(private archive: ArchiveService) { }

  toggleSelect(broadcast: BroadcastModel, e: Event) {
    if (this.archive.selectedBroadcast == broadcast) broadcast = null;
    this.archive.selectedBroadcast = broadcast;
    e.preventDefault();
  }

  get selected(): BroadcastModel {
    return this.archive.selectedBroadcast;
  }



}
