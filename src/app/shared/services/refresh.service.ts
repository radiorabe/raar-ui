import { Injectable } from "@angular/core";
import { ReplaySubject } from "rxjs";

@Injectable()
export class RefreshService extends ReplaySubject<void> {
  constructor() {
    super(1);
  }
}
