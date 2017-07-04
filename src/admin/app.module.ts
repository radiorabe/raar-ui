import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { SharedModule } from '../app/shared/shared.module';
import { SharedAdminModule } from './shared/shared-admin.module';
import { AppComponent } from './app.component';
import { AppRoutes } from './app.routes';
import { ShowsModule } from './shows/shows.module';
import { ProfilesModule } from './profiles/profiles.module';
import { ShowsService } from './shows/services/shows.service';
import { ShowsRestService } from './shows/services/shows-rest.service';
import { ProfilesService } from './profiles/services/profiles.service';
import { ProfilesRestService } from './profiles/services/profiles-rest.service';
import { AudioEncodingsService } from './profiles/services/audio-encodings.service';

import * as moment from 'moment';
import 'moment/locale/de';

moment.locale('de');

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    SharedModule,
    ShowsModule,
    ProfilesModule,
    RouterModule.forRoot(AppRoutes),
    SharedModule.forRoot(),
    SharedAdminModule.forRoot()
  ],
  declarations: [AppComponent],
  providers: [
    { provide: APP_BASE_HREF, useValue: '<%= APP_BASE %>' },
    ShowsRestService,
    ProfilesRestService,
    ShowsService,
    ProfilesService,
    AudioEncodingsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
