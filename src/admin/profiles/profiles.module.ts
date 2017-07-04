import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { SharedModule } from '../../app/shared/shared.module';
import { SharedAdminModule } from '../shared/shared-admin.module';
import { ProfilesRoutes } from './profiles.routes';
import { ProfilesComponent } from './components/profiles.component';
import { ProfilesInitComponent } from './components/profiles-init.component';
import { ProfileFormComponent } from './components/profile-form.component';
import { ArchiveFormatFormComponent } from './components/archive-format-form.component';

@NgModule({
  imports: [
    SharedModule,
    SharedAdminModule,
    RouterModule.forChild(ProfilesRoutes),
    AccordionModule.forRoot()
  ],
  declarations: [
    ProfilesComponent,
    ProfilesInitComponent,
    ProfileFormComponent,
    ArchiveFormatFormComponent
  ],
  exports: []
})
export class ProfilesModule { }
