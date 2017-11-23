import { Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { BroadcastRoutes } from './broadcasts/broadcast.routes';

export const routes: Routes = [
  ...BroadcastRoutes
];
