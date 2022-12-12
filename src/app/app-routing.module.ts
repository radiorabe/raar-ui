import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BroadcastRoutes } from "./broadcasts/broadcast.routes";

const routes: Routes = [...BroadcastRoutes];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
