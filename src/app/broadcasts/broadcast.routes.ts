import { Route } from "@angular/router";

import { BroadcastsShowComponent } from "./broadcasts-show.component";
import { BroadcastsDateComponent } from "./broadcasts-date.component";
import { BroadcastsSearchComponent } from "./broadcasts-search.component";

export const BroadcastRoutes: Route[] = [
  {
    path: "show/:id",
    component: BroadcastsShowComponent
  },
  {
    path: "search/:query",
    component: BroadcastsSearchComponent
  },
  {
    path: ":year/:month/:day",
    component: BroadcastsDateComponent
  },
  {
    path: "**",
    component: BroadcastsDateComponent
  }
];
