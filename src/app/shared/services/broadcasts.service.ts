import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { CrudService } from './crud.service';
import { DateParamsService } from './date_params.service';
import { BroadcastModel, ShowModel, CrudList } from '../models/index';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class BroadcastsService extends CrudService<BroadcastModel> {

  constructor(http: Http) {
    super(http, '/api/broadcasts');
  }

  getListForShow(show: ShowModel): Observable<CrudList<BroadcastModel>> {
    return this.getList({show_id: show.id, sort: '-started_at'});
  }

  getListForDate(date: Date): Observable<CrudList<BroadcastModel>> {
    return this.http.get(this.baseUrl + DateParamsService.convertDateToPath(date), this.options)
      .map(res => this.buildListFromResponse(res, this.buildEntity))
      .catch(this.handleHttpError.bind(this));
  }

  getForTime(date: Date): Observable<BroadcastModel> {
    return this.http.get(this.baseUrl + DateParamsService.convertTimeToPath(date), this.options)
      .map(res => this.buildBroadcastFromResponse(res))
      .catch(this.handleHttpError.bind(this));
  }

  protected buildEntity(): BroadcastModel {
    return new BroadcastModel();
  }

  private buildBroadcastFromResponse(res: Response): BroadcastModel | void {
    const data = res.json()['data'];
    if (data.length === 0) {
      return undefined;
    } else {
      return this.copyAttributes(data[0], this.buildEntity());
    }
  }

}
