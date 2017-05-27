import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../app/shared/shared.module';
import { ShowsRoutes } from './shows.routes';
import { ShowsComponent } from './components/shows.component';
import { ShowsInitComponent } from './components/shows-init.component';
import { ShowFormComponent } from './components/show-form.component';
import { ShowsService } from './services/shows.service';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(ShowsRoutes),
  ],
  declarations: [
    ShowsComponent,
    ShowsInitComponent,
    ShowFormComponent
  ],
  exports: [],
  providers: [
    ShowsService
  ]
})
export class ShowsModule { }
