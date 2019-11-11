import { Component, Input, OnInit } from "@angular/core";
import { TrackModel } from "../shared/models/index";
import { TracksService } from "../shared/services/tracks.service";
import * as moment from "moment";
import { forkJoin, Observable } from "rxjs";
import { Router, ActivatedRoute } from "@angular/router";
import { DateParamsService } from "../shared/services/date-params.service";

// Show the tracks for the currently running shows that
// have not yet been imported into the archive.
@Component({
  selector: "sd-running-broadcast",
  templateUrl: "running-broadcast.html"
})
export class RunningBroadcastComponent implements OnInit {
  @Input() expanded: boolean;

  @Input() date: Date;

  tracks: TrackModel[] = [];

  constructor(private tracksService: TracksService, private router: Router) {}

  ngOnInit() {
    if (this.expanded) {
      this.fetchTracks();
    }
  }

  toggle() {
    this.expanded = !this.expanded;
    if (this.expanded) {
      this.fetchTracks();
      this.navigateToSelf();
    }
  }

  private fetchTracks() {
    if (!this.tracks.length) {
      forkJoin(this.fetchTracksForMissingHours()).subscribe(
        lists =>
          (this.tracks = lists.reduce((acc, list) => acc.concat(list), []))
      );
    }
  }

  private fetchTracksForMissingHours(): Observable<TrackModel[]>[] {
    const lastHour = moment(this.date);
    const now = moment();
    const hours = lastHour.isSame(now, "day")
      ? now.diff(lastHour, "hours")
      : 23 - lastHour.get("hour");
    const missingHours = Array.from(Array(hours + 1).keys());
    return missingHours.map(hour => {
      const date = lastHour
        .clone()
        .add(hour, "hours")
        .toDate();
      return this.tracksService.getListForHour(date);
    });
  }

  private navigateToSelf() {
    if (!this.broadcastRoute) return;
    let url = this.broadcastRoute.snapshot.url.map(e => e.path);
    let queryParams = {
      time: DateParamsService.convertTimeToParam(this.date)
    };
    this.router.navigate([...url, queryParams]);
  }

  private get broadcastRoute(): ActivatedRoute {
    var state = <any>this.router.routerState;
    return state.firstChild(state.root);
  }
}
