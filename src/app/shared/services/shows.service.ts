import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ReadRestService } from "./read-rest.service";
import { ShowModel } from "../models/show.model";

@Injectable()
export class ShowsService extends ReadRestService<ShowModel> {
  constructor() {
    super("/api/shows");
  }

  protected buildEntity(): ShowModel {
    return new ShowModel();
  }
}
