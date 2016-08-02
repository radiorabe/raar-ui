import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ShowModel, BroadcastModel, AudioFileModel, CrudList} from '../shared/models/index';
import {BroadcastsService, AudioFilesService} from '../shared/services/index';
import {AudioPlayerService} from './player/audio_player.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/debounceTime';

@Injectable()
export class ArchiveService {

  private _selectedBroadcast: BroadcastModel;

  constructor(private broadcastsService: BroadcastsService,
              private audioFilesService: AudioFilesService,
              public audioPlayer: AudioPlayerService,
              private router: Router) {
  }

  get selectedBroadcast(): BroadcastModel {
    return this._selectedBroadcast;
  }

  set selectedBroadcast(broadcast: BroadcastModel) {
    this._selectedBroadcast = broadcast;
    this.fetchAudioFiles(broadcast);
  }

  play(audio: AudioFileModel) {
    this.audioPlayer.play(audio);
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
