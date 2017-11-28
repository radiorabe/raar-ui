import { Injectable } from '@angular/core';
import { CrudRestService } from '../../shared/services/crud-rest.service';
import { DowngradeActionModel } from '../models/downgrade-action.model';
import { AdminRemoteService } from '../../shared/services/admin-remote.service';

@Injectable()
export class DowngradeActionsRestService extends CrudRestService<DowngradeActionModel> {

  profileId: number;
  archiveFormatId: number;

  constructor(remote: AdminRemoteService) {
    super(remote, '/api/admin/profiles/{profileId}/archive_formats/{archiveFormatId}/downgrade_actions');
  }

  protected get baseUrl(): string {
    return this.baseUrlTemplate
      .replace('{profileId}', this.profileId.toString())
      .replace('{archiveFormatId}', this.archiveFormatId.toString());
  }

  protected buildEntity(): DowngradeActionModel {
    return new DowngradeActionModel();
  }

}
