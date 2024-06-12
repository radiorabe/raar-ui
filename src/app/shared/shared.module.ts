import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { LoginComponent } from "./components/login.component";
import { SliderComponent } from "./components/slider.component";
import { SmallModalComponent } from "./components/small-modal.component";
import { AudioFilesService } from "./services/audio-files.service";
import { LoginWindowService } from "./services/login-window.service";
import { AuthService } from "./services/auth.service";
import { RefreshService } from "./services/refresh.service";
import { TokenAuthService } from "./services/token-auth.service";
import { TracksService } from "./services/tracks.service";
import { LayoutComponent } from "./components/layout.component";
import { LoginService } from "./services/login.service";
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { AddAuthHeaderInterceptor } from "./services/add-auth-header-interceptor.service";
import { RemoteErrorInterceptor } from "./services/remote-error-interceptor.service";

const interceptors = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AddAuthHeaderInterceptor,
    multi: true,
  },
  { provide: HTTP_INTERCEPTORS, useClass: RemoteErrorInterceptor, multi: true },
];

@NgModule({
  declarations: [
    LayoutComponent,
    LoginComponent,
    SliderComponent,
    SmallModalComponent,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    LayoutComponent,
    LoginComponent,
    SliderComponent,
    SmallModalComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        AudioFilesService,
        TracksService,
        AuthService,
        LoginService,
        { provide: TokenAuthService, useExisting: AuthService },
        LoginWindowService,
        RefreshService,
        provideHttpClient(withInterceptorsFromDi()),
        ...interceptors,
      ],
    };
  }
}
