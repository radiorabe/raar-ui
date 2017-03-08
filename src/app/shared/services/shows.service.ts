import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {CrudService} from './crud.service';
import {ShowModel} from '../models/show.model';

@Injectable()
export class ShowsService extends CrudService<ShowModel> {

  constructor(http: Http) {
    super(http, '/api/shows')
  }

  protected buildEntity(): ShowModel {
    return new ShowModel();
  }
}
