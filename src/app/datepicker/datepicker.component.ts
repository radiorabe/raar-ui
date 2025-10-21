import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import dayjs from "dayjs";
import objectSupport from "dayjs/plugin/objectSupport";
import { interval, Subject } from "rxjs";
import {
  distinctUntilChanged,
  filter,
  map,
  startWith,
  takeUntil,
} from "rxjs/operators";
import { DateParamsService } from "../shared/services/date-params.service";
import { DpDatePickerModule } from "ng2-date-picker";
import { FormsModule } from "@angular/forms";
import { AsyncPipe } from "@angular/common";

dayjs.extend(objectSupport);

const TODAY_UPDATE_INTERVAL = 60000;

@Component({
  selector: "sd-datepicker",
  templateUrl: "datepicker.html",
  imports: [DpDatePickerModule, FormsModule, AsyncPipe],
})
export class DatepickerComponent implements OnInit, OnDestroy {
  today$ = interval(TODAY_UPDATE_INTERVAL).pipe(
    startWith(0),
    map(() => dayjs().format("YYYY-MM-DD")),
    distinctUntilChanged(),
    map((dateStr) => dayjs(dateStr)),
  );

  dayPickerConfig$ = this.today$.pipe(
    map((date) => {
      return {
        firstDayOfWeek: "mo" as const,
        locale: "de",
        max: date,
        monthFormat: "MMMM YYYY",
        weekdayFormat: "dd",
        showGoToCurrent: false,
      };
    }),
  );

  private router = inject(Router);

  private _date: dayjs.Dayjs;

  private readonly destroy$ = new Subject<void>();

  ngOnInit() {
    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        filter((e) => e instanceof NavigationEnd),
      )
      .subscribe((_) => this.setDateFromRoute());
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  get date(): dayjs.Dayjs {
    return this._date;
  }

  set date(date: dayjs.Dayjs) {
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
      this._date = dayjs({ year: +year, month: +month - 1, day: +day });
    } else {
      this._date = undefined;
    }
  }

  private navigateToDate(date: dayjs.Dayjs) {
    const url = this.dateRoute.snapshot.url.map((e) => e.path);
    const year = date.year().toString();
    const month = DateParamsService.zeroPad(date.month() + 1);
    const day = DateParamsService.zeroPad(date.date());
    if (url[0] !== year || url[1] !== month || url[2] !== day) {
      this.router.navigate([year, month, day]);
    }
  }

  private get dateRoute(): ActivatedRoute {
    const state = <any>this.router.routerState;
    return state.firstChild(state.root);
  }
}
