import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DpDatePickerModule } from 'ng2-date-picker';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { SharedModule } from '../shared/shared.module';
import { SharedArchiveModule } from './shared/shared-archive.module';
import { BroadcastsService, ShowsService } from '../shared/services/index';
import { AudioFilesService } from './shared/services/audio_files.service';
import { AudioPlayerService } from './player/audio_player.service';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { ShowsComponent } from './shows/shows.component';
import { BroadcastComponent } from './broadcasts/broadcast.component';
import { BroadcastsShowComponent } from './broadcasts/broadcasts_show.component';
import { BroadcastsDateComponent } from './broadcasts/broadcasts_date.component';
import { PlayerComponent } from './player/player.component';
import { BroadcastTimePipe } from './shared/pipes/broadcast_time.pipe';
import { DateStringPipe } from '../shared/pipes/date_string.pipe';
import { PreventDefaultLinkDirective } from '../shared/directives/prevent_default_link_directive';
import { BroadcastsSearchComponent } from './broadcasts/broadcasts_search.component';

import * as moment from 'moment';
import 'moment/locale/de';
import { SearchComponent } from './search/search.component';

moment.locale('de');
(<any>window).soundManager.setup({ debugMode: false });

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(routes),
    SharedModule.forRoot(),
    SharedArchiveModule.forRoot(),
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
    BroadcastTimePipe,
    PreventDefaultLinkDirective
  ],
  exports: [AppComponent],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: '<%= APP_BASE %>'
    },
    BroadcastsService,
    ShowsService,
    AudioFilesService,
    AudioPlayerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
