import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './components/login.component';
import { SliderComponent } from './components/slider.component';
import { SmallModalComponent } from './components/small-modal.component';
import { AudioFilesService } from './services/audio_files.service';
import { LoginWindowService } from './services/login-window.service';
import { AuthService } from './services/auth.service';
import { RefreshService } from './services/refresh.service';
import { RemoteService } from '../../shared/services/index';
import { TokenAuthService } from '../../shared/services/token-auth.service';
import { TracksService } from './services/tracks.service';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  declarations: [
    LoginComponent,
    SliderComponent,
    SmallModalComponent
  ],
  exports: [
    LoginComponent,
    SliderComponent,
    SmallModalComponent
  ]
})
export class SharedArchiveModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedArchiveModule,
      providers: [
        AudioFilesService,
        TracksService,
        AuthService,
        { provide: TokenAuthService, useExisting: AuthService },
        LoginWindowService,
        RefreshService,
        RemoteService]
    };
  }
}
