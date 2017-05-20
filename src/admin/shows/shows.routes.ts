import { Routes } from '@angular/router';

import { ShowsComponent } from './shows.component';
import { ShowsInitComponent } from './shows-init.component';
import { ShowFormComponent } from './show-form.component';

export const ShowsRoutes: Routes = [
  {
    path: 'shows',
    component: ShowsComponent,
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
