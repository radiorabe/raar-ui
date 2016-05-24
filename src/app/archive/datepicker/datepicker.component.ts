import { Component } from '@angular/core';
import {DATEPICKER_DIRECTIVES} from 'ng2-bootstrap';
import {ArchiveService} from '../archive.service';


@Component({
  moduleId: module.id,
  selector: 'sd-datepicker',
  templateUrl: 'datepicker.html',
  directives: [DATEPICKER_DIRECTIVES]
})
export class DatepickerComponent  {

  public constructor(private archive: ArchiveService) {  }

  public get date() {
    return this.archive.date;
  }

  public set date(date: Date) {
    this.archive.date = date;
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
