import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import dayjs from "dayjs";
import "dayjs/locale/de-ch";
import { DatepickerComponent } from "./datepicker/datepicker.component";
import { PlayerComponent } from "./player/player.component";
import { SearchComponent } from "./search/search.component";
import { LayoutComponent } from "./shared/components/layout.component";
import { LoginComponent } from "./shared/components/login.component";
import { AuthService } from "./shared/services/auth.service";
import { LoginWindowService } from "./shared/services/login-window.service";
import { ShowsComponent } from "./shows/shows.component";

dayjs.locale("de-ch");

(<any>window).soundManager.setup({ debugMode: false });

@Component({
  selector: "sd-app",
  templateUrl: "app.html",
  imports: [
    LayoutComponent,
    DatepickerComponent,
    SearchComponent,
    ShowsComponent,
    PlayerComponent,
    LoginComponent,
    AsyncPipe,
  ],
})
export class AppComponent {
  auth = inject(AuthService);
  private loginWindow = inject(LoginWindowService);

  constructor() {
    this.auth.isLoggedIn.subscribe();
  }

  showLogin() {
    this.loginWindow.show();
  }

  logout() {
    this.auth.logout();
  }
}
