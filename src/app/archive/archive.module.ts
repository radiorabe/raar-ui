import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedModule } from '../shared/shared.module';
import { ArchiveComponent } from './archive.component';
import { BroadcastsService, ShowsService, AudioFilesService }
from '../shared/services/index';
import { AudioPlayerService } from './player/audio_player.service';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { ShowsComponent } from './shows/shows.component';
import { BroadcastComponent } from './broadcasts/broadcast.component';
import { BroadcastsShowComponent } from './broadcasts/broadcasts_show.component';
import { BroadcastsDateComponent } from './broadcasts/broadcasts_date.component';
import { PlayerComponent } from './player/player.component';
import { BroadcastTimePipe } from '../shared/pipes/broadcast_time.pipe';
import { DateStringPipe } from '../shared/pipes/date_string.pipe';
import { SliderComponent } from '../shared/components/slider.component';
import { PreventDefaultLinkDirective } from '../shared/directives/prevent_default_link_directive';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DatepickerModule.forRoot(),
    InfiniteScrollModule],
  declarations: [
    ArchiveComponent,
    DatepickerComponent,
    ShowsComponent,
    BroadcastsShowComponent,
    BroadcastsDateComponent,
    BroadcastComponent,
    PlayerComponent,
    DateStringPipe,
    BroadcastTimePipe,
    SliderComponent,
    PreventDefaultLinkDirective],
  exports: [ArchiveComponent],
  providers: [
    BroadcastsService,
    ShowsService,
    AudioFilesService,
    AudioPlayerService]
})
export class ArchiveModule { }
