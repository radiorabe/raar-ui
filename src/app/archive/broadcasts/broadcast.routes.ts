import { RouterConfig } from '@angular/router';

import {BroadcastsShowComponent} from './broadcasts_show.component';
import {BroadcastsDateComponent} from './broadcasts_date.component';

export const BroadcastRoutes: RouterConfig = [
  {
    path: 'show/:id',
    component: BroadcastsShowComponent
  },
  {
    path: ':year/:month/:day/:time',
    component: BroadcastsDateComponent
  },
  {
    path: ':year/:month/:day',
    component: BroadcastsDateComponent
  },
  {
    path: '**',
    component: BroadcastsDateComponent
  }
];
