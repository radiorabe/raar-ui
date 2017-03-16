import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ISubscription } from 'rxjs/Subscription';


@Component({
  moduleId: module.id,
  selector: 'sd-datepicker',
  templateUrl: 'datepicker.html',
})
export class DatepickerComponent  {

  private _date: Date;
  private sub: ISubscription;

  public constructor(private router: Router) {
  }

  ngOnInit() {
    this.sub = this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.setDateFromRoute();
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
    this._date = date;
    this.router.navigate([date.getFullYear(), date.getMonth() + 1, date.getDate()]);
  }

  public getMode(): string {
    return 'day';
  }

  public today(): Date {
    return new Date();
  }

  private setDateFromRoute() {
    const state = <any>this.router.routerState;
    const dateRoute = state.firstChild(state.firstChild(state.root));
    if (dateRoute && dateRoute.url.value[0] && dateRoute.url.value[0].path.match(/\d{4}/)) {
      this.setDateFromParams(dateRoute.snapshot.params);
    }
  }

  private setDateFromParams(params: any) {
    let year = params['year'];
    let month = params['month'];
    let day = params['day'];
    if (year && month && day) {
      this._date = new Date(+year, +month - 1, +day);
    } else {
      this._date = undefined;
    }
  }


}
