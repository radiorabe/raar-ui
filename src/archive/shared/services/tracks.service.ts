import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BroadcastModel, TrackModel, CrudList } from '../../../shared/models/index';
import { ReadRestService } from '../../../shared/services/read-rest.service';
import { RemoteService } from '../../../shared/services/index';

@Injectable()
export class TracksService extends ReadRestService<TrackModel> {

  constructor(remote: RemoteService) {
    super(remote, '/api/tracks');
  }

  getListForBroadcast(broadcast: BroadcastModel): Observable<CrudList<TrackModel>> {
    return this.getList({ broadcast_id: broadcast.id, sort: 'started_at', 'page[size]': 500 })
      .switchMap(list => this.loadAllEntries(list));
  }

  protected buildEntity(): TrackModel {
    return new TrackModel();
  }

  private loadAllEntries(list: CrudList<TrackModel>): Observable<CrudList<TrackModel>> {
    if (list.links.next) {
      return this.getNextEntries(list).switchMap(l => this.loadAllEntries(l));
    } else {
      return Observable.of(list);
    }
  }

}
