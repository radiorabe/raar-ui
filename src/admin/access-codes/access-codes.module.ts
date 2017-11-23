import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { SharedAdminModule } from '../shared/shared-admin.module';
import { AccessCodesRoutes } from './access-codes.routes';
import { AccessCodesComponent } from './components/access-codes.component';
import { AccessCodesInitComponent } from './components/access-codes-init.component';
import { AccessCodeFormComponent } from './components/access-code-form.component';
import { AccessCodesService } from './services/access-codes.service';
import { AccessCodesRestService } from './services/access-codes-rest.service';

@NgModule({
  imports: [
    SharedModule,
    SharedAdminModule,
    RouterModule.forChild(AccessCodesRoutes)
  ],
  declarations: [
    AccessCodesComponent,
    AccessCodesInitComponent,
    AccessCodeFormComponent
  ],
  exports: [],
  providers: [
    AccessCodesRestService,
    AccessCodesService
  ]
})
export class AccessCodesModule { }
