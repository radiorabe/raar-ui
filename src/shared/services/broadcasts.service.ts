import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { ReadRestService } from './read-rest.service';
import { DateParamsService } from './date_params.service';
import { BroadcastModel, ShowModel, CrudList } from '../models/index';
import { Observable } from 'rxjs/Observable';
import { RemoteService } from './remote.service';

@Injectable()
export class BroadcastsService extends ReadRestService<BroadcastModel> {

  constructor(remote: RemoteService) {
    super(remote, '/api/broadcasts');
  }

  getListForShow(show: ShowModel): Observable<CrudList<BroadcastModel>> {
    return this.getList({ show_id: show.id, sort: '-started_at' });
  }

  getListForDate(date: Date): Observable<CrudList<BroadcastModel>> {
    return this.remote.get(this.baseUrl + DateParamsService.convertDateToPath(date))
      .catch(res => this.handleError(res))
      .map(res => this.buildListFromResponse(res, this.buildEntity));
  }

  getListForQuery(query: string): Observable<CrudList<BroadcastModel>> {
    return this.getList({ q: query, sort: '-started_at' });
  }

  getForTime(date: Date): Observable<BroadcastModel | void> {
    return this.remote.get(this.baseUrl + DateParamsService.convertTimeToPath(date))
      .catch(res => this.handleError(res))
      .map(res => this.buildBroadcastFromResponse(res));
  }

  update(entity: BroadcastModel, entityToUpdate: BroadcastModel = entity): Observable<BroadcastModel> {
    return this.remote.patch(`${this.baseUrl}/${entity.id}`, this.rootedJson(entity))
      .catch(res => this.handleError(res))
      .map(res => this.updateEntityFromResponse(res, entityToUpdate));
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

  private rootedJson(entity: BroadcastModel): string {
    let data: any = {};
    data['data'] = entity;
    return JSON.stringify(data);
  }

}
