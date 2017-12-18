import { Route } from '@angular/router';

import { BroadcastsShowComponent } from './broadcasts_show.component';
import { BroadcastsDateComponent } from './broadcasts_date.component';
import { BroadcastsSearchComponent } from './broadcasts_search.component';

export const BroadcastRoutes: Route[] = [
  {
    path: 'show/:id',
    component: BroadcastsShowComponent
  },
  {
    path: 'search/:query',
    component: BroadcastsSearchComponent
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
