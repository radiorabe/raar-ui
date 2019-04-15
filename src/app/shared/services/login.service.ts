import { Injectable } from "@angular/core";
import {
  HttpParams,
  HttpClient,
  HttpHeaders,
  HttpResponse
} from "@angular/common/http";
import { UserModel } from "../models/user.model";
import { PatchedQueryEncoder } from "./patched-query-encoder";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class LoginService {
  constructor(protected http: HttpClient) {}

  get(token: string): Observable<UserModel> {
    const headers = new HttpHeaders({
      "Content-Type": "application/vnd.api+json",
      Authorization: 'Token token="' + token + '"',
      "Skip-Error-Handling": "true"
    });
    return this.http
      .get("/api/login", { headers, observe: "response" })
      .pipe(map(res => this.setUserFromResponse(res)));
  }

  post(username: string, password: string): Observable<UserModel> {
    const body = new HttpParams({ encoder: new PatchedQueryEncoder() })
      .append("username", username)
      .append("password", password);
    const headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      "Skip-Error-Handling": "true"
    });

    return this.http
      .post("/api/login", body, { headers, observe: "response" })
      .pipe(map(res => this.setUserFromResponse(res)));
  }

  private setUserFromResponse(res: HttpResponse<Object>): UserModel {
    const user = new UserModel();
    Object.assign(user, res.body["data"]);
    user.attributes.admin_token = res.headers.get("X-Auth-Token");
    return user;
  }
}
