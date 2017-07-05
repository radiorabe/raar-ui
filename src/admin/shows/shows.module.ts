import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../app/shared/shared.module';
import { SharedAdminModule } from '../shared/shared-admin.module';
import { ShowsRoutes } from './shows.routes';
import { ShowsComponent } from './components/shows.component';
import { ShowsInitComponent } from './components/shows-init.component';
import { ShowFormComponent } from './components/show-form.component';
import { ShowsService } from './services/shows.service';
import { ShowsRestService } from './services/shows-rest.service';
import { ProfilesService } from '../profiles/services/profiles.service';
import { ProfilesRestService } from '../profiles/services/profiles-rest.service';

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
  exports: [],
  providers: [
    ShowsRestService,
    ShowsService,
    ProfilesRestService,
    ProfilesService
  ]
})
export class ShowsModule { }
