import { EventEmitter } from '@angular/core';

export class LoginWindowService {

  show$ = new EventEmitter<void>();
  closed$ = new EventEmitter<void>();

  show() {
    this.show$.emit();
  }

  closed() {
    this.closed$.emit();
  }

}
