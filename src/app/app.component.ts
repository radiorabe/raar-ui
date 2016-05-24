import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES, Routes } from '@angular/router';
import { HTTP_PROVIDERS } from '@angular/http';
import { ArchiveComponent } from './archive/archive.component';

/**
 * This class represents the main application component. Within the @Routes annotation is the configuration of the
 * applications routes, configuring the paths for the lazy loaded components (HomeComponent, AboutComponent).
 */
@Component({
  moduleId: module.id,
  selector: 'sd-app',
  viewProviders: [HTTP_PROVIDERS],
  templateUrl: 'app.html',
  directives: [ROUTER_DIRECTIVES, ArchiveComponent]
})
@Routes([
  {
    path: '/',
    component: ArchiveComponent
  }
])
export class AppComponent {}
