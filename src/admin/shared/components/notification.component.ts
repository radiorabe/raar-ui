import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NotificationService, Notification } from '../services/notification.service';
import { Subject } from 'rxjs/Subject';

const NOTIFICATION_DURATION = 5000;

@Component({
  moduleId: module.id,
  selector: 'sd-notification',
  templateUrl: 'notification.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationComponent {

  current: Notification | undefined;
  show = false;

  private timer: any;
  private readonly destroy$ = new Subject();

  constructor(private notifications: NotificationService,
              private cd: ChangeDetectorRef) {
    notifications
      .takeUntil(this.destroy$)
      .subscribe(n => {
        this.current = n;
        this.show = true;
        this.clearTimer();
        this.timer = setTimeout(() => this.close(), NOTIFICATION_DURATION);
        this.cd.markForCheck();
      });
  }

  onDestroy() {
    this.destroy$.next();
  }

  close() {
    this.show = false;
    this.clearTimer();
    this.timer = undefined;
    this.cd.markForCheck();
  }

  private clearTimer(): void {
    if (this.timer) clearTimeout(this.timer);
  }

}
