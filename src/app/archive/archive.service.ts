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

@Injectable()
export class ArchiveService {

  show: Subject<ShowModel> = new ReplaySubject<ShowModel>(1);
  date: Subject<Date> = new BehaviorSubject<Date>(new Date());
  broadcastList: Subject<CrudList<BroadcastModel>> = new ReplaySubject<CrudList<BroadcastModel>>(1);
  private fetchMore: Subject<boolean> = new Subject<boolean>();
  private _selectedBroadcast: BroadcastModel;

  constructor(private broadcastsService: BroadcastsService,
              private audioFilesService: AudioFilesService,
              public audioPlayer: AudioPlayerService,
              private router: Router) {
    this.broadcastShowObservable()
      .merge(this.broadcastDateObservable(),
             this.broadcastMoreObservable())
      .subscribe(this.broadcastList);
  }

  setShow(show: ShowModel) {
    this._selectedBroadcast = null;
    this.show.next(show);
    if (show) {
      window.scroll(0, 0);
    }
  }

  setDate(date: Date) {
    this._selectedBroadcast = null;
    this.show.next(null);
    this.date.next(date);
  }

  get selectedBroadcast(): BroadcastModel {
    return this._selectedBroadcast;
  }

  set selectedBroadcast(broadcast: BroadcastModel) {
    this._selectedBroadcast = broadcast;
    this.fetchAudioFiles(broadcast);
  }

  get broadcasts(): Observable<BroadcastModel[]> {
    return this.broadcastList.map(list => list.entries);
  }

  play(audio: AudioFileModel) {
    this.audioPlayer.play(audio);
  }

  fetchNextBroadcasts() {
    this.fetchMore.next(true);
  }

  private broadcastShowObservable(): Observable<CrudList<BroadcastModel>> {
    return this.show
      .filter(show => !!show)
      .distinctUntilChanged()
      .flatMap(show => this.broadcastsService.getListForShow(show));
  }

  private broadcastDateObservable(): Observable<CrudList<BroadcastModel>> {
    return this.date
      .distinctUntilChanged()
      .flatMap(date => this.broadcastsService.getListForDate(date));
  }

  private broadcastMoreObservable(): Observable<CrudList<BroadcastModel>> {
    return this.fetchMore
      .withLatestFrom(this.broadcastList, (_, list) => list)
      .flatMap(list => this.broadcastsService.getNextEntries(list));
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
