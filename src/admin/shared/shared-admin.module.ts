import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../app/shared/shared.module';
import { AdminRemoteService } from './services/admin-remote.service';
import { AdminGuard } from './services/admin.guard';
import { FieldErrorsComponent } from './components/field-errors.component';
import { FormErrorsComponent } from './components/form-errors.component';
import { TopNavComponent } from './components/top-nav.component';
import { AddButtonComponent } from './components/add-button.component';
import { ShowsService } from '../shows/services/shows.service';
import { ShowsRestService } from '../shows/services/shows-rest.service';
import { ProfilesService } from '../profiles/services/profiles.service';
import { ProfilesRestService } from '../profiles/services/profiles-rest.service';
/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    FieldErrorsComponent,
    FormErrorsComponent,
    TopNavComponent,
    AddButtonComponent,
  ],
  exports: [
    FieldErrorsComponent,
    FormErrorsComponent,
    TopNavComponent,
    AddButtonComponent,
  ],
  providers: [
    ShowsRestService,
    ProfilesRestService,
    ShowsService,
    ProfilesService
  ]
})
export class SharedAdminModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedAdminModule,
      providers: [AdminRemoteService, AdminGuard]
    };
  }
}
