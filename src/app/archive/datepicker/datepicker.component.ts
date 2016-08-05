import { Component } from '@angular/core';
import { FORM_DIRECTIVES } from '@angular/forms';
import { Router } from '@angular/router';
import {DATEPICKER_DIRECTIVES} from 'ng2-bootstrap';
import {ISubscription} from 'rxjs/Subscription';


@Component({
  moduleId: module.id,
  selector: 'sd-datepicker',
  templateUrl: 'datepicker.html',
  directives: [FORM_DIRECTIVES, DATEPICKER_DIRECTIVES]
})
export class DatepickerComponent  {

  private _date: Date;
  private sub: ISubscription;

  public constructor(private router: Router) {
  }

  ngOnInit() {
    const state = this.router.routerState;
    const dateRoute = state.firstChild(state.firstChild(state.root));
    if (dateRoute === null) return;
    this.sub = dateRoute.params
      .subscribe(params => {
        let year = params['year'];
        let month = params['month'];
        let day = params['day'];
        if (year && month && day) {
          this._date = new Date(+year, +month - 1, +day);
        } else {
          this._date = this.today();
        }
      });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  public get date() {
    return this._date;
  }

  public set date(date: Date) {
    this.router.navigate([date.getFullYear(), date.getMonth() + 1, date.getDate()])
  }

  public getMode(): string {
    return 'day';
  }

  public today(): Date {
    return new Date();
  }

}
