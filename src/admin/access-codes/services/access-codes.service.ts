import { Injectable } from '@angular/core';
import { ModelsService } from '../../shared/services/models.service';
import { AccessCodeModel } from '../models/access-code.model';
import { AccessCodesRestService } from './access-codes-rest.service';
import * as moment from 'moment';

@Injectable()
export class AccessCodesService extends ModelsService<AccessCodeModel> {

  protected sortAttr = 'expires_at';

  constructor(rest: AccessCodesRestService) {
    super(rest);
  }

  protected sortEntries(entries: AccessCodeModel[]): AccessCodeModel[] {
    return entries.sort((a: AccessCodeModel, b: AccessCodeModel) => {
      return moment.utc(a.attributes.expires_at).diff(moment.utc(b.attributes.expires_at))
    });
  }

}
