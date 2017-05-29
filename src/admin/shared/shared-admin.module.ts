import { NgModule, ModuleWithProviders } from '@angular/core';
import { AdminRemoteService } from './services/admin-remote.service';
import { AdminGuard } from './services/admin.guard';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
  ],
  declarations: [
  ],
  exports: [
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
