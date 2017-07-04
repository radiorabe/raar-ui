import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../app/shared/shared.module';
import { SharedAdminModule } from '../shared/shared-admin.module';
import { ProfilesRoutes } from './profiles.routes';
import { ProfilesComponent } from './components/profiles.component';
import { ProfilesInitComponent } from './components/profiles-init.component';
import { ProfileFormComponent } from './components/profile-form.component';
import { ProfilesService } from './services/profiles.service';

@NgModule({
  imports: [
    SharedModule,
    SharedAdminModule,
    RouterModule.forChild(ProfilesRoutes),
  ],
  declarations: [
    ProfilesComponent,
    ProfilesInitComponent,
    ProfileFormComponent
  ],
  exports: [],
  providers: [
    ProfilesService
  ]
})
export class ProfilesModule { }
