import { enableProdMode, importProvidersFrom } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { environment } from "./environments/environment";
import { BroadcastsService } from "./app/shared/services/broadcasts.service";
import { ShowsService } from "./app/shared/services/shows.service";
import { AudioFilesService } from "./app/shared/services/audio-files.service";
import { AudioPlayerService } from "./app/player/audio-player.service";
import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";
import { AppRoutingModule } from "./app/app-routing.module";
import { SharedModule } from "./app/shared/shared.module";
import { CommonModule } from "@angular/common";
import { DpDatePickerModule } from "ng2-date-picker";
import { InfiniteScrollDirective } from "ngx-infinite-scroll";
import { AppComponent } from "./app/app.component";

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      AppRoutingModule,
      SharedModule.forRoot(),
      CommonModule,
      DpDatePickerModule,
      InfiniteScrollDirective,
    ),
    BroadcastsService,
    ShowsService,
    AudioFilesService,
    AudioPlayerService,
  ],
}).catch((err) => console.error(err));
