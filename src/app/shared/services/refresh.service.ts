import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Injectable()
export class RefreshService extends ReplaySubject<void> {

  constructor() {
    super(1);
  }

}
