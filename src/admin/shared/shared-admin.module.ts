import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../app/shared/shared.module';
import { AdminRemoteService } from './services/admin-remote.service';
import { AdminGuard } from './services/admin.guard';
import { FieldErrorsComponent } from './components/field-errors.component';
import { FormErrorsComponent } from './components/form-errors.component';
import { TopNavComponent } from './components/top-nav.component';
import { AddButtonComponent } from './components/add-button.component';
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
