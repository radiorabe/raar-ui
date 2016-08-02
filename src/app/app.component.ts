import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { HTTP_PROVIDERS } from '@angular/http';
import { ArchiveComponent } from './archive/archive.component';


@Component({
  moduleId: module.id,
  selector: 'sd-app',
  viewProviders: [HTTP_PROVIDERS],
  templateUrl: 'app.html',
  directives: [ROUTER_DIRECTIVES, ArchiveComponent]
})
export class AppComponent {
  constructor() {
  }
}
