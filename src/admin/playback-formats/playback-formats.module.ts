import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../app/shared/shared.module';
import { SharedAdminModule } from '../shared/shared-admin.module';
import { PlaybackFormatsRoutes } from './playback-formats.routes';
import { PlaybackFormatsComponent } from './components/playback-formats.component';
import { PlaybackFormatsInitComponent } from './components/playback-formats-init.component';
import { PlaybackFormatFormComponent } from './components/playback-format-form.component';
import { PlaybackFormatsService } from './services/playback-formats.service';
import { PlaybackFormatsRestService } from './services/playback-formats-rest.service';

@NgModule({
  imports: [
    SharedModule,
    SharedAdminModule,
    RouterModule.forChild(PlaybackFormatsRoutes),
  ],
  declarations: [
    PlaybackFormatsComponent,
    PlaybackFormatsInitComponent,
    PlaybackFormatFormComponent
  ],
  exports: [],
  providers: [
    PlaybackFormatsRestService,
    PlaybackFormatsService
  ]
})
export class PlaybackFormatsModule { }
