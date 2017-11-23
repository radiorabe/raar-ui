import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from '../../shared/components/layout.component';
import { LoginService, AuthService, RemoteService, LoginWindowService, RefreshService } from '../../shared/services/index';
import { LoginComponent } from './components/login.component';
import { SliderComponent } from './components/slider.component';
import { SmallModalComponent } from './components/small-modal.component';
import { AudioFilesService } from './services/audio_files.service';

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
      providers: [AudioFilesService]
    };
  }
}
