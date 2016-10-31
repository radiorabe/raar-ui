import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { PreventDefaultLinkDirective } from './shared/directives/prevent_default_link_directive';

import { ArchiveModule } from './archive/archive.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(routes),
    ArchiveModule,
    SharedModule.forRoot()],
  declarations: [AppComponent],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>'
  }],
    //provide: PLATFORM_DIRECTIVES,
    //useValue: PreventDefaultLinkDirective,
    //multi: true }
  bootstrap: [AppComponent]

})

export class AppModule { }
