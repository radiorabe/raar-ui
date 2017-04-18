import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { LoginService } from './login.service';
import { UserModel } from '../models/index';

const API_TOKEN_KEY = 'api-token';

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
    this.storeToken(API_TOKEN_KEY, user.attributes.api_token);
  }

  get apiToken(): string {
    return this.getToken(API_TOKEN_KEY);
  }

  public addAuthToken(headers: Headers) {
    headers.set('Authorization', 'Token token="' + this.getToken(API_TOKEN_KEY) + '"');
  }

  private getToken(key: string): string {
    return window.localStorage.getItem(key) || '';
  }

  private storeToken(key: string, value: string) {
    if (!value) return;
    window.localStorage.setItem(key, value);
  }

  private checkAuth() {
    if (!this._initialized) {
      this._initialized = true;
      const token = this.getToken(API_TOKEN_KEY);
      this.login.get(token).subscribe(
        user => this._user = user,
        err => this._initialized = true,
        () => this._initialized = true);
    }
  }

}
