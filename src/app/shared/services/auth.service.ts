import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { UserModel } from '../models/index';

@Injectable()
export class AuthService {

  private _user: UserModel;

  private _initialized: boolean = false;

  constructor(private login: LoginService) {}

  get isLoggedIn(): boolean {
    this.checkAuth();
    return !!this._user;
  }

  get user(): UserModel {
    this.checkAuth();
    return this._user;
  }

  set user(user: UserModel) {
    this._user = user;
  }

  private checkAuth() {
    if (!this._initialized) {
      this._initialized = true;
      this.login.get().subscribe(
        user => this._user = user,
        err => this._initialized = true,
        () => this._initialized = true);
    }
  }

}
