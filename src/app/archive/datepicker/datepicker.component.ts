import { Component } from '@angular/core';
import { FORM_DIRECTIVES } from '@angular/forms';
import {DATEPICKER_DIRECTIVES} from 'ng2-bootstrap';
import {ArchiveService} from '../archive.service';


@Component({
  moduleId: module.id,
  selector: 'sd-datepicker',
  templateUrl: 'datepicker.html',
  directives: [FORM_DIRECTIVES, DATEPICKER_DIRECTIVES]
})
export class DatepickerComponent  {

  private _date: Date;

  public constructor(private archive: ArchiveService) {
    this.archive.date.subscribe(date => this._date = date);
  }

  public get date() {
    return this._date;
  }

  public set date(date: Date) {
    this.archive.setDate(date);
  }

  public getDate(): number {
    return this.date && this.date.getTime() || new Date().getTime();
  }

  public getMode(): string {
    return 'day';
  }

  public today(): Date {
    return new Date();
  }

}
