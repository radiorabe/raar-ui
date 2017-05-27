import { Component, ChangeDetectionStrategy } from '@angular/core';
//import { Config } from './shared/config/env.config';
import './operators';

@Component({
  moduleId: module.id,
  selector: 'sd-app',
  templateUrl: 'app.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
}
