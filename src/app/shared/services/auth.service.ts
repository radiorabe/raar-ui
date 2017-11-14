import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { LoginWindowService } from './login-window.service';
import { RefreshService } from './refresh.service';
import { UserModel } from '../models/index';
import { Observable } from 'rxjs/Observable';
import { zip } from 'rxjs/observable/zip';

const API_TOKEN_KEY = 'api_token';
const ADMIN_TOKEN_KEY = 'admin_token';

@Injectable()
export class AuthService {

  private _user: UserModel | void;

  private _initialized: boolean = false;

  private _initializedAdmin: boolean = false;

  private _redirectUrl: string | void;

  constructor(private login: LoginService,
              private refresh: RefreshService,
              private router: Router,
              private loginWindow: LoginWindowService) {
  }

  get isLoggedIn(): Observable<boolean> {
    return this.checkUserAuth().map(_ => !!this._user);
  }

  get isAdminLoggedIn(): Observable<boolean> {
    return this.checkAdminAuth().map(_ => !!this._user && this.hasAdminToken);
  }

  get hasAdminToken(): boolean {
    return !!this.adminToken;
  }

  get user(): UserModel | void {
    return this._user;
  }

  set user(user: UserModel | void) {
    this._user = user;
    if (user) {
      this.storeToken(API_TOKEN_KEY, user.attributes.api_token);
      if (user.attributes.admin_token) {
        this.storeToken(ADMIN_TOKEN_KEY, user.attributes.admin_token);
      }
    }
    if (this._redirectUrl) {
      this.router.navigate([this._redirectUrl]);
      this._redirectUrl = undefined;
    } else {
      this.refresh.next(undefined);
    }
  }

  set redirectUrl(url: string) {
    this._redirectUrl = url;
  }

  get apiToken(): string {
    return this.getToken(API_TOKEN_KEY);
  }

  get adminToken(): string {
    return this.getToken(ADMIN_TOKEN_KEY);
  }

  logout() {
    this._user = undefined;
    this.clearToken(API_TOKEN_KEY);
    this.clearToken(ADMIN_TOKEN_KEY);
    this.refresh.next(undefined);
  }

  addAuthToken(headers: Headers) {
    if (!headers.get('Authorization')) {
      headers.set('Authorization', 'Token token="' + this.apiToken + '"');
    }
  }

  addAdminAuthToken(headers: Headers) {
    if (!headers.get('Authorization')) {
      headers.set('Authorization', 'Token token="' + this.adminToken + '"');
    }
  }

  resetUser() {
    this._initialized = false;
    this._initializedAdmin = false;
    this._user = undefined;
    this.loginWindow.show();
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

  private checkUserAuth(): Observable<void> {
    if (!this._initialized) {
      this._initialized = true;
      return this.checkAuth(API_TOKEN_KEY);
    } else {
      return Observable.of(undefined);
    }
  }

  private checkAdminAuth(): Observable<void> {
    if (!this._initializedAdmin) {
      this._initializedAdmin = true;
      return this.checkAuth(ADMIN_TOKEN_KEY);
    } else {
      return Observable.of(undefined);
    }
  }

  private checkAuth(key: string): Observable<void> {
    const token = this.getToken(key);
    return this.login.get(token)
      .map(user => {
        this._user = user;
        return undefined;
      })
      .catch(err => Observable.of(undefined));
  }

}
