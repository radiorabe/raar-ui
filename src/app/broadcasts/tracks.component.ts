import { TrackModel } from "../shared/models";
import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from "@angular/core";

@Component({
  selector: "sd-tracks",
  templateUrl: "tracks.html",
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
