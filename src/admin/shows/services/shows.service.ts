import { Injectable } from '@angular/core';
import { ModelsService } from '../../shared/services/models.service';
import { ShowModel } from '../models/show.model';
import { ShowsRestService } from './shows-rest.service';

@Injectable()
export class ShowsService extends ModelsService<ShowModel> {

  protected sortAttr = 'name';

  constructor(rest: ShowsRestService) {
    super(rest);
  }

}
