import { Injectable } from '@angular/core';
import { CrudRestService } from '../../shared/services/crud-rest.service';
import { ArchiveFormatModel } from '../models/archive-format.model';
import { AdminRemoteService } from '../../shared/services/admin-remote.service';

@Injectable()
export class ArchiveFormatsRestService extends CrudRestService<ArchiveFormatModel> {

  public profileId: number;

  constructor(remote: AdminRemoteService) {
    super(remote, '/api/admin/profiles/{profileId}/archive_formats');
  }

  protected get baseUrl(): string {
    return this.baseUrlTemplate.replace('{profileId}', this.profileId.toString());
  }

  protected buildEntity(): ArchiveFormatModel {
    return new ArchiveFormatModel();
  }

}
