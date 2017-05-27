import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { LoginService } from './login.service';
import { UserModel } from '../models/index';

const API_TOKEN_KEY = 'api_token';

@Injectable()
export class AuthService {

  private _user: UserModel | void;

  private _initialized: boolean = false;

  constructor(private login: LoginService) {}

  get isLoggedIn(): boolean {
    this.checkAuth();
    return !!this._user;
  }

  get user(): UserModel | void {
    this.checkAuth();
    return this._user;
  }

  set user(user: UserModel | void) {
    this._user = user;
    this.storeToken(API_TOKEN_KEY, user.attributes.api_token);
  }

  get apiToken(): string {
    return this.getToken(API_TOKEN_KEY);
  }

  logout() {
    this._user = undefined;
    this.clearToken(API_TOKEN_KEY);
  }

  addAuthToken(headers: Headers) {
    headers.set('Authorization', 'Token token="' + this.getToken(API_TOKEN_KEY) + '"');
  }

  private getToken(key: string): string {
    try {
      return window.localStorage.getItem(key) || '';
    } catch (e) {
      if (this.user) {
        return (<any>this.user.attributes)[key] || '';
      } else {
        return '';
      }
    }
  }

  private storeToken(key: string, value: string) {
    if (!value) return;
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      // no local storage, no problem
    }
  }

  private clearToken(key: string) {
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      // no local storage, no problem
    }
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
