import {UserModel} from '../models/index';

export class AuthService {

  private user: UserModel;

  get isLoggedIn() {
    return !!this.user;
  }

}
