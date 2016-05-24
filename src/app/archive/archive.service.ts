import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ShowModel, BroadcastModel, AudioFileModel, CrudList} from '../shared/models/index';
import {BroadcastsService, AudioFilesService} from '../shared/services/index';
import {AudioPlayerService} from './player/audio_player.service';

@Injectable()
export class ArchiveService {

  private _show: ShowModel;
  private _date: Date = new Date();
  private _broadcastList: CrudList<BroadcastModel> = new CrudList<BroadcastModel>();
  private _selectedBroadcast: BroadcastModel;

  constructor(private broadcastsService: BroadcastsService,
              private audioFilesService: AudioFilesService,
              public audioPlayer: AudioPlayerService,
              private router: Router) {}

  get show(): ShowModel {
    return this._show;
  }

  set show(show: ShowModel) {
    this._show = show;
    this._selectedBroadcast = null;
    this.fetchBroadcasts();
    if (show) {
      window.scroll(0, 0);
    }
  }

  get date(): Date {
    return this._date;
  }

  set date(date: Date) {
    this._date = date;
    this._show = null;
    this._selectedBroadcast = null;
    this.fetchBroadcasts();
  }

  get selectedBroadcast(): BroadcastModel {
    return this._selectedBroadcast;
  }

  set selectedBroadcast(broadcast: BroadcastModel) {
    this._selectedBroadcast = broadcast;
    this.fetchAudioFiles(broadcast);
  }

  get broadcasts(): BroadcastModel[] {
    return this._broadcastList.entries;
  }

  play(audio: AudioFileModel) {
    this.audioPlayer.play(audio);
  }

  hasMoreBroadcasts(): boolean {
    return this._broadcastList.links.next != undefined;
  }

  fetchNextBroadcasts() {
    this.broadcastsService.getNextEntries(this._broadcastList);
  }

  private fetchBroadcasts() {
    if (this._show) {
      this.broadcastsService.getListForShow(this._show).subscribe(list => this._broadcastList = list);
    } else if (this._date) {
      this.broadcastsService.getListForDate(this._date).subscribe(list => this._broadcastList = list);
    }
  }

  private fetchAudioFiles(broadcast: BroadcastModel) {
    if (broadcast && !broadcast.relationships.audio_files) {
      this.audioFilesService.getListForBroadcast(broadcast)
        .subscribe(list => {
          broadcast.relationships.audio_files = list.entries;
          for (const a of list.entries) a.relationships.broadcast = broadcast;
          return list;
        });
    }
  }
}
