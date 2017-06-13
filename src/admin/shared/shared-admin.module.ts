import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRemoteService } from './services/admin-remote.service';
import { AdminGuard } from './services/admin.guard';
import { FieldErrorsComponent } from './components/field-errors.component';
import { FormErrorsComponent } from './components/form-errors.component';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    FieldErrorsComponent,
    FormErrorsComponent
  ],
  exports: [
    FieldErrorsComponent,
    FormErrorsComponent
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
