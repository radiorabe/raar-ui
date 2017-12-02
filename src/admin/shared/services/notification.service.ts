import { Injectable } from "@angular/core";
import { ReplaySubject } from "rxjs/ReplaySubject";

export class Notification {
  constructor(public success: boolean,
              public message: string) {}
}

@Injectable()
export class NotificationService extends ReplaySubject<Notification> {

  constructor() {
    super(1);
  }

  notify(success: boolean, message: string): void {
    this.next(new Notification(success, message));
  }

}