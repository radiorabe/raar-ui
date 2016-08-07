import { RouterConfig } from '@angular/router';

import { ArchiveComponent } from './archive.component';
import {BroadcastRoutes} from './broadcasts/broadcast.routes';

export const ArchiveRoutes: RouterConfig = [
  {
    path: '',
    component: ArchiveComponent,
    children: BroadcastRoutes
  },
  {
    path: '**',
    component: ArchiveComponent
  }
];
