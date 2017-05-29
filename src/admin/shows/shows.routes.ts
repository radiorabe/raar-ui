import { Routes } from '@angular/router';
import { AdminGuard } from '../shared/services/admin.guard';
import { ShowsComponent } from './components/shows.component';
import { ShowsInitComponent } from './components/shows-init.component';
import { ShowFormComponent } from './components/show-form.component';

export const ShowsRoutes: Routes = [
  {
    path: 'shows',
    component: ShowsComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: ':id',
        component: ShowFormComponent
      },
      {
        path: '',
        component: ShowsInitComponent
      }
    ]
  }
];
