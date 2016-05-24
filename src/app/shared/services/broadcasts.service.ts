import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {CrudService} from './crud.service';
import {BroadcastModel, ShowModel, CrudList} from '../models/index';
import {Observable} from "rxjs/Observable";

@Injectable()
export class BroadcastsService extends CrudService<BroadcastModel> {

  constructor(http: Http) {
    super(http, '/api/v1/broadcasts')
  }

  getListForShow(show: ShowModel): Observable<CrudList<BroadcastModel>> {
    return this.getList({show_id: show.id, sort: '-started_at'});
  }

  getListForDate(date: Date): Observable<CrudList<BroadcastModel>> {
    return this.http.get(this.baseUrl + this.convertDateToPath(date), this.options)
      .map(res => this.buildListFromResponse(res, this.buildEntity));
  }

  protected buildEntity(): BroadcastModel {
    return new BroadcastModel();
  }

  private convertDateToPath(date: Date): string {
    return '/' +
           [date.getFullYear(),
            this.zeroPad(date.getMonth() + 1),
            this.zeroPad(date.getDate())]
           .join('/');
  }

  private zeroPad(n: number): string {
    return ('0' + n).slice(-2);
  }
}
