import { enableProdMode, importProvidersFrom } from "@angular/core";

import { environment } from "./environments/environment";
import { BroadcastsService } from "./app/shared/services/broadcasts.service";
import { ShowsService } from "./app/shared/services/shows.service";
import { AudioFilesService } from "./app/shared/services/audio-files.service";
import { AudioPlayerService } from "./app/player/audio-player.service";
import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";
import { AppRoutingModule } from "./app/app-routing.module";
import { CommonModule } from "@angular/common";
import { DpDatePickerModule } from "ng2-date-picker";
import { InfiniteScrollDirective } from "ngx-infinite-scroll";
import { AppComponent } from "./app/app.component";
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { AddAuthHeaderInterceptor } from "./app/shared/services/add-auth-header-interceptor.service";
import { RemoteErrorInterceptor } from "./app/shared/services/remote-error-interceptor.service";
import { TracksService } from "./app/shared/services/tracks.service";
import { AuthService } from "./app/shared/services/auth.service";
import { LoginService } from "./app/shared/services/login.service";
import { TokenAuthService } from "./app/shared/services/token-auth.service";
import { LoginWindowService } from "./app/shared/services/login-window.service";
import { RefreshService } from "./app/shared/services/refresh.service";

if (environment.production) {
  enableProdMode();
}

const interceptors = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AddAuthHeaderInterceptor,
    multi: true,
  },
  { provide: HTTP_INTERCEPTORS, useClass: RemoteErrorInterceptor, multi: true },
];

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      AppRoutingModule,
      CommonModule,
      DpDatePickerModule,
      InfiniteScrollDirective,
    ),
    BroadcastsService,
    ShowsService,
    AudioPlayerService,
    AudioFilesService,
    TracksService,
    AuthService,
    LoginService,
    LoginWindowService,
    RefreshService,
    { provide: TokenAuthService, useExisting: AuthService },
    provideHttpClient(withInterceptorsFromDi()),
    ...interceptors,
  ],
}).catch((err) => console.error(err));
