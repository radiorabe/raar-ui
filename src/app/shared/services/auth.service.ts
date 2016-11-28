import {UserModel} from '../models/index.ts';

export class AuthService {

  private user: UserModel;

  get isLoggedIn() {
    return !!this.user;
  }

}
