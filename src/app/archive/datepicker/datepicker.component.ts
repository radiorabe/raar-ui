import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ISubscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import * as moment from 'moment';

const TODAY_UPDATE_INTERVAL = 60000;

@Component({
  moduleId: module.id,
  selector: 'sd-datepicker',
  templateUrl: 'datepicker.html'
})
export class DatepickerComponent implements OnInit, OnDestroy  {

  public today$ = Observable.interval(TODAY_UPDATE_INTERVAL)
    .startWith(0)
    .map(() => moment().format('YYYY-MM-DD'))
    .distinctUntilChanged()
    .map(dateStr => moment(dateStr));

  public dayPickerConfig$ = this.today$.map(date => {
    return {
      firstDayOfWeek: 'mo',
      locale: 'de',
      max: date,
      monthFormat: 'MMMM YYYY',
      weekdayFormat: 'dd',
      showGoToCurrent: false
    }
  });

  private _date: moment.Moment | void;
  private sub: ISubscription;

  public constructor(private router: Router) {
  }

  ngOnInit() {
    this.sub = this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.setDateFromRoute();
      }
    });
    this.setDateFromRoute();
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  public get date(): moment.Moment | void {
    return this._date;
  }

  public set date(date: moment.Moment | void) {
    this._date = date;

    if (date) {
      this.navigateToDate(date);
    }
  }

  private setDateFromRoute() {
    const state = <any>this.router.routerState;
    const dateRoute = state.firstChild(state.firstChild(state.root));
    if (dateRoute && dateRoute.url.value[0] && /\d{4}/.test(dateRoute.url.value[0].path)) {
      this.setDateFromParams(dateRoute.snapshot.params);
    }
  }

  private setDateFromParams(params: any) {
    let year = params['year'];
    let month = params['month'];
    let day = params['day'];
    if (year && month && day) {
      this._date = moment({ year: +year, month: +month - 1, day: +day });
    } else {
      this._date = undefined;
    }
  }

  private navigateToDate(date: moment.Moment) {
    const url = this.dateRoute.snapshot.url.map(e => e.path);
    const year = date.year().toString();
    const month = (date.month() + 1).toString();
    const day = date.date().toString();
    if (url[0] !== year || url[1] !== month || url[2] !== day) {
      this.router.navigate([year, month, day]);
    }
  }

  private get dateRoute(): ActivatedRoute {
    var state = <any>this.router.routerState;
    return state.firstChild(state.firstChild(state.root));
  }

}
