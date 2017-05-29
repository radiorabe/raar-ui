import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { LoginService } from './login.service';
import { UserModel } from '../models/index';

const API_TOKEN_KEY = 'api_token';
const ADMIN_TOKEN_KEY = 'admin_token';

@Injectable()
export class AuthService {

  private _user: UserModel;

  private _initialized: boolean = false;

  constructor(private login: LoginService) {}

  get isLoggedIn(): boolean {
    this.checkAuth();
    return !!this._user;
  }

  get isAdmin(): boolean {
    return !!this.adminToken;
  }

  get user(): UserModel {
    this.checkAuth();
    return this._user;
  }

  set user(user: UserModel) {
    this._user = user;
    this.storeToken(API_TOKEN_KEY, user.attributes.api_token);
    if (user.attributes.admin_token) {
      this.storeToken(ADMIN_TOKEN_KEY, user.attributes.admin_token);
    }
  }

  get apiToken(): string {
    return this.getToken(API_TOKEN_KEY);
  }

  get adminToken(): string {
    return this.getToken(ADMIN_TOKEN_KEY);
  }

  public addAuthToken(headers: Headers) {
    if (!headers.get('Authorization')) {
      headers.set('Authorization', 'Token token="' + this.apiToken + '"');
    }
  }

  public addAdminAuthToken(headers: Headers) {
    if (!headers.get('Authorization')) {
      headers.set('Authorization', 'Token token="' + this.adminToken + '"');
    }
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
