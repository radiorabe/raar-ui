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

import * as moment from "moment";
import "moment/locale/de";
import { SearchComponent } from "./search/search.component";

moment.locale("de");
(<any>window).soundManager.setup({ debugMode: false });

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule.forRoot(),
    CommonModule,
    DpDatePickerModule,
    InfiniteScrollModule
  ],
  declarations: [
    AppComponent,
    DatepickerComponent,
    SearchComponent,
    ShowsComponent,
    BroadcastsShowComponent,
    BroadcastsDateComponent,
    BroadcastsSearchComponent,
    BroadcastComponent,
    PlayerComponent,
    DateStringPipe,
    BroadcastTimePipe
  ],
  exports: [AppComponent],
  providers: [
    BroadcastsService,
    ShowsService,
    AudioFilesService,
    AudioPlayerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
