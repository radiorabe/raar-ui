import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { Subject, interval } from "rxjs";
import {
  startWith,
  map,
  distinctUntilChanged,
  filter,
  takeUntil
} from "rxjs/operators";
import * as moment from "moment";

const TODAY_UPDATE_INTERVAL = 60000;

@Component({
  selector: "sd-datepicker",
  templateUrl: "datepicker.html"
})
export class DatepickerComponent implements OnInit, OnDestroy {
  today$ = interval(TODAY_UPDATE_INTERVAL).pipe(
    startWith(0),
    map(() => moment().format("YYYY-MM-DD")),
    distinctUntilChanged(),
    map(dateStr => moment(dateStr))
  );

  dayPickerConfig$ = this.today$.pipe(
    map(date => {
      return {
        firstDayOfWeek: "mo",
        locale: "de",
        max: date,
        monthFormat: "MMMM YYYY",
        weekdayFormat: "dd",
        showGoToCurrent: false
      };
    })
  );

  private _date: moment.Moment | void;

  private readonly destroy$ = new Subject();

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        filter(e => e instanceof NavigationEnd)
      )
      .subscribe(_ => this.setDateFromRoute());
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  get date(): moment.Moment | void {
    return this._date;
  }

  set date(date: moment.Moment | void) {
    this._date = date;

    if (date) {
      this.navigateToDate(date);
    }
  }

  private setDateFromRoute() {
    const dateRoute = <any>this.dateRoute;
    if (
      dateRoute &&
      dateRoute.url.value[0] &&
      /\d{4}/.test(dateRoute.url.value[0].path)
    ) {
      this.setDateFromParams(dateRoute.snapshot.params);
    }
  }

  private setDateFromParams(params: any) {
    const year = params["year"];
    const month = params["month"];
    const day = params["day"];
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
    if (url[0] !== year || url[1] !== month || url[2] !== day) {
      this.router.navigate([year, month, day]);
    }
  }

  private get dateRoute(): ActivatedRoute {
    const state = <any>this.router.routerState;
    return state.firstChild(state.root);
  }
}
