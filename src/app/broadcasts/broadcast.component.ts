import { Component, Input, OnChanges, isDevMode } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  BroadcastModel,
  AudioFileModel,
  TrackModel
} from "../shared/models/index";
import { LoginWindowService } from "../shared/services/login-window.service";
import { AudioPlayerService } from "../player/audio-player.service";
import { AudioFilesService } from "../shared/services/audio-files.service";
import { DateParamsService } from "../shared/services/date-params.service";
import { TracksService } from "../shared/services/tracks.service";
import { finalize } from "rxjs/operators";

@Component({
  selector: "sd-broadcast",
  templateUrl: "broadcast.html"
})
export class BroadcastComponent implements OnChanges {
  @Input() broadcast: BroadcastModel;
  @Input() dateFormat: string;
  @Input() expanded: boolean;
  @Input() view: "month" | "day";

  loadingAudio: boolean = false;
  loadingTracks: boolean = false;

  tracks: TrackModel[] = [];

  constructor(
    public audioPlayer: AudioPlayerService,
    public loginWindow: LoginWindowService,
    private audioFilesService: AudioFilesService,
    private tracksService: TracksService,
    private router: Router
  ) {}

  ngOnChanges(changes: any) {
    if (changes.broadcast) {
      this.tracks = [];
      if (this.expanded) {
        this.fetchAudioFiles();
        this.fetchTracks();
      }
    }
  }

  toggle() {
    this.expanded = !this.expanded;
    if (this.expanded) {
      this.fetchAudioFiles();
      this.fetchTracks();
      this.navigateToSelf();
    }
  }

  play(audio: AudioFileModel, time?: Date) {
    this.audioPlayer.play(audio, time);
    this.navigateToPlay(audio, time);
  }

  download(audio: AudioFileModel) {
    (<any>window).location = (isDevMode() ? "/api" : "") + audio.links.download;
  }

  get audioFiles(): AudioFileModel[] | void {
    return this.broadcast.relationships.audio_files;
  }

  playTrack(track: TrackModel) {
    const audio = this.isBroadcastPlaying()
      ? this.audioPlayer.audioFile
      : this.getFirstAudioFile();
    this.play(audio, track.attributes.started_at);
  }

  isTracksPlayable(): boolean {
    return this.audioFiles && this.audioFiles.length > 0;
  }

  isTrackPlaying(track: TrackModel): boolean {
    const pos = this.audioPlayer.position;
    return (
      track.attributes.started_at <= pos && track.attributes.finished_at > pos
    );
  }

  private isBroadcastPlaying(): boolean {
    return (
      this.audioPlayer.audioFile &&
      this.audioPlayer.audioFile.relationships.broadcast.id ===
        this.broadcast.id
    );
  }

  private getFirstAudioFile(): AudioFileModel {
    const files = (<AudioFileModel[]>this.audioFiles).sort((a, b) => {
      if (a.attributes.codec === b.attributes.codec) {
        return a.attributes.bitrate - b.attributes.bitrate;
      } else {
        return a.attributes.codec === "mp3" ? -1 : 1;
      }
    });
    // get second lowest quality
    return files[files.length === 1 ? 0 : 1];
  }

  private fetchAudioFiles() {
    if (!this.audioFiles && this.broadcast.attributes.audio_access) {
      this.loadingAudio = true;
      this.audioFilesService
        .getListForBroadcast(this.broadcast)
        .pipe(finalize(() => (this.loadingAudio = false)))
        .subscribe(
          list => (this.broadcast.relationships.audio_files = list.entries)
        );
    }
  }

  private fetchTracks() {
    if (!this.tracks.length) {
      this.loadingTracks = true;
      this.tracksService
        .getListForBroadcast(this.broadcast)
        .pipe(finalize(() => (this.loadingTracks = false)))
        .subscribe(list => (this.tracks = list.entries));
    }
  }

  private navigateToSelf(queryParams: any = {}, time?: Date) {
    if (!this.broadcastRoute) return;
    let url = this.broadcastRoute.snapshot.url.map(e => e.path);
    const date = time || this.broadcast.attributes.started_at;
    queryParams["time"] = DateParamsService.convertTimeToParam(date);
    if (url[0] === "show" || url[0] === "search") {
      queryParams["year"] = date.getFullYear();
      queryParams["month"] = date.getMonth() + 1;
      queryParams["day"] = date.getDate();
    } else if (url[url.length - 1] !== date.getDate().toString()) {
      // handle shows that begin before midnight and go on to the current day.
      queryParams["time"] = "0000";
    }
    this.router.navigate([...url, queryParams]);
  }

  private navigateToPlay(audio: AudioFileModel, time?: Date) {
    this.navigateToSelf(
      {
        play: audio.attributes.playback_format,
        format: audio.attributes.codec
      },
      time
    );
  }

  private get broadcastRoute(): ActivatedRoute {
    var state = <any>this.router.routerState;
    return state.firstChild(state.root);
  }
}
