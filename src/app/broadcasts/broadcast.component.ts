import { UpperCasePipe } from "@angular/common";
import { Component, Input, OnChanges, inject, isDevMode } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { finalize } from "rxjs/operators";
import { AudioPlayerService } from "../player/audio-player.service";
import {
  AudioFileModel,
  BroadcastModel,
  TrackModel,
} from "../shared/models/index";
import { BroadcastTimePipe } from "../shared/pipes/broadcast-time.pipe";
import { AudioFilesService } from "../shared/services/audio-files.service";
import { DateParamsService } from "../shared/services/date-params.service";
import { LoginWindowService } from "../shared/services/login-window.service";
import { TracksService } from "../shared/services/tracks.service";
import { BroadcastDescriptionFormComponent } from "./broadcast-description-form.component";
import { TracksComponent } from "./tracks.component";

@Component({
  selector: "sd-broadcast",
  templateUrl: "broadcast.html",
  imports: [
    BroadcastDescriptionFormComponent,
    RouterLink,
    TracksComponent,
    UpperCasePipe,
    BroadcastTimePipe,
  ],
})
export class BroadcastComponent implements OnChanges {
  audioPlayer = inject(AudioPlayerService);
  loginWindow = inject(LoginWindowService);
  private audioFilesService = inject(AudioFilesService);
  private tracksService = inject(TracksService);
  private router = inject(Router);

  @Input() broadcast: BroadcastModel;
  @Input() dateFormat: string;
  @Input() expanded: boolean;
  @Input() view: "month" | "day";

  loadingAudio: boolean = false;

  tracks: TrackModel[] = [];

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

  showLogin(userLogin: boolean = false) {
    this.loginWindow.show(userLogin);
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
          (list) => (this.broadcast.relationships.audio_files = list.entries),
        );
    }
  }

  private fetchTracks() {
    if (!this.tracks.length) {
      this.tracksService
        .getListForBroadcast(this.broadcast)
        .subscribe((list) => (this.tracks = list.entries));
    }
  }

  private navigateToSelf(queryParams: any = {}, time?: Date) {
    if (!this.broadcastRoute) return;
    let url = this.broadcastRoute.snapshot.url.map((e) => e.path);
    const date = time || this.broadcast.attributes.started_at;
    queryParams["time"] = DateParamsService.convertTimeToParam(date);
    if (url[0] === "show" || url[0] === "search") {
      queryParams["year"] = date.getFullYear();
      queryParams["month"] = DateParamsService.zeroPad(date.getMonth() + 1);
      queryParams["day"] = DateParamsService.zeroPad(date.getDate());
    } else if (
      url[url.length - 1] !== DateParamsService.zeroPad(date.getDate())
    ) {
      // handle shows that begin before midnight and go on to the current day.
      queryParams["time"] = "0000";
    }
    this.router.navigate([...url, queryParams]);
  }

  private navigateToPlay(audio: AudioFileModel, time?: Date) {
    this.navigateToSelf(
      {
        play: audio.attributes.playback_format,
        format: audio.attributes.codec,
      },
      time,
    );
  }

  private get broadcastRoute(): ActivatedRoute {
    var state = <any>this.router.routerState;
    return state.firstChild(state.root);
  }
}
