import { CrudModel } from './crud.model';

export class UserModel extends CrudModel {

  attributes: {
    username: string;
    first_name: string;
    last_name: string;
    groups: string[];
    api_token: string;
    api_key_expires_at: Date;
    admin: boolean;
    admin_token?: string;
  };

  toString(): string {
    return this.attributes.first_name ||
           this.attributes.last_name ||
           this.attributes.username;
  }
}
