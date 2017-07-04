import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../app/shared/shared.module';
import { SharedAdminModule } from '../shared/shared-admin.module';
import { ShowsRoutes } from './shows.routes';
import { ShowsComponent } from './components/shows.component';
import { ShowsInitComponent } from './components/shows-init.component';
import { ShowFormComponent } from './components/show-form.component';

@NgModule({
  imports: [
    SharedModule,
    SharedAdminModule,
    RouterModule.forChild(ShowsRoutes),
  ],
  declarations: [
    ShowsComponent,
    ShowsInitComponent,
    ShowFormComponent
  ],
  exports: []
})
export class ShowsModule { }
