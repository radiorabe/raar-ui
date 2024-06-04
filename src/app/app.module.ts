import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { CommonModule } from "@angular/common";
import { DpDatePickerModule } from "ng2-date-picker";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { AppComponent } from "./app.component";
import { SharedModule } from "./shared/shared.module";
import { BroadcastsService } from "./shared/services/broadcasts.service";
import { ShowsService } from "./shared/services/shows.service";
import { AudioFilesService } from "./shared/services/audio-files.service";
import { AudioPlayerService } from "./player/audio-player.service";
import { DatepickerComponent } from "./datepicker/datepicker.component";
import { ShowsComponent } from "./shows/shows.component";
import { BroadcastComponent } from "./broadcasts/broadcast.component";
import { BroadcastsShowComponent } from "./broadcasts/broadcasts-show.component";
import { BroadcastsDateComponent } from "./broadcasts/broadcasts-date.component";
import { PlayerComponent } from "./player/player.component";
import { BroadcastTimePipe } from "./shared/pipes/broadcast-time.pipe";
import { DateStringPipe } from "./shared/pipes/date-string.pipe";
import { BroadcastsSearchComponent } from "./broadcasts/broadcasts-search.component";

import { SearchComponent } from "./search/search.component";
import { BroadcastsMonthlyComponent } from "./broadcasts/broadcasts-monthly.component";
import { BroadcastDescriptionFormComponent } from "./broadcasts/broadcast-description-form.component";
import { TracksComponent } from "./broadcasts/tracks.component";
import { RunningBroadcastComponent } from "./broadcasts/running-broadcast.component";

import dayjs from "dayjs";
import "dayjs/locale/de-ch";
import { provideHttpClient } from "@angular/common/http";

dayjs.locale("de-ch");

(<any>window).soundManager.setup({ debugMode: false });

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule.forRoot(),
    CommonModule,
    DpDatePickerModule,
    InfiniteScrollModule,
  ],
  declarations: [
    AppComponent,
    DatepickerComponent,
    SearchComponent,
    ShowsComponent,
    BroadcastsShowComponent,
    BroadcastsDateComponent,
    BroadcastsSearchComponent,
    BroadcastsMonthlyComponent,
    BroadcastComponent,
    BroadcastDescriptionFormComponent,
    TracksComponent,
    RunningBroadcastComponent,
    PlayerComponent,
    DateStringPipe,
    BroadcastTimePipe,
  ],
  exports: [AppComponent],
  providers: [
    BroadcastsService,
    ShowsService,
    AudioFilesService,
    AudioPlayerService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
