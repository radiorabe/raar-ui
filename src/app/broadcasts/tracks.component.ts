import { TrackModel } from "../shared/models";
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { DateStringPipe } from "../shared/pipes/date-string.pipe";

@Component({
  selector: "sd-tracks",
  templateUrl: "tracks.html",
  imports: [DateStringPipe],
})
export class TracksComponent {
  @Input()
  tracks: TrackModel[] = [];

  @Input()
  playable = false;

  @Input()
  playPosition: Date | undefined;

  @Output()
  playTrack = new EventEmitter<TrackModel>();

  isTrackPlaying(track: TrackModel): boolean {
    return (
      this.playPosition &&
      track.attributes.started_at <= this.playPosition &&
      track.attributes.finished_at > this.playPosition
    );
  }
}
