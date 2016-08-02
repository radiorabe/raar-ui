import { provideRouter, RouterConfig } from '@angular/router';

import { ArchiveRoutes } from './archive/archive.routes';

const routes: RouterConfig = [
  ...ArchiveRoutes
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes),
];
