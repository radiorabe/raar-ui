import { Routes } from '@angular/router';
import { AdminGuard } from '../shared/services/admin.guard';
import { ProfilesComponent } from './components/profiles.component';
import { ProfilesInitComponent } from './components/profiles-init.component';
import { ProfileFormComponent } from './components/profile-form.component';

export const ProfilesRoutes: Routes = [
  {
    path: 'profiles',
    component: ProfilesComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: 'new',
        component: ProfileFormComponent
      },
      {
        path: ':id',
        component: ProfileFormComponent
      },
      {
        path: '',
        component: ProfilesInitComponent
      }
    ]
  }
];
