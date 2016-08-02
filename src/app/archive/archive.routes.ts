import { RouterConfig } from '@angular/router';

import { ArchiveComponent } from './archive.component';
import {BroadcastsShowComponent} from './broadcasts/broadcasts_show.component';
import {BroadcastsDateComponent} from './broadcasts/broadcasts_date.component';

export const ArchiveRoutes: RouterConfig = [
  {
    path: '',
    component: ArchiveComponent,
    children: [
      {
        path: 'show/:id',
        component: BroadcastsShowComponent
      },
      {
        path: ':year/:month/:day',
        component: BroadcastsDateComponent
      },
      {
        path: '*',
        component: BroadcastsDateComponent
      }
    ]
  },
  {
    path: '**',
    component: ArchiveComponent
  }
];
