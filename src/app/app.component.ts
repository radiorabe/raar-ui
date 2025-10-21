import { Component } from "@angular/core";
import { AuthService } from "./shared/services/auth.service";
import { LoginWindowService } from "./shared/services/login-window.service";
import { LayoutComponent } from "./shared/components/layout.component";
import { DatepickerComponent } from "./datepicker/datepicker.component";
import { SearchComponent } from "./search/search.component";
import { ShowsComponent } from "./shows/shows.component";
import { PlayerComponent } from "./player/player.component";
import { LoginComponent } from "./shared/components/login.component";
import { AsyncPipe } from "@angular/common";
import dayjs from "dayjs";
import "dayjs/locale/de-ch";

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
  constructor(
    public auth: AuthService,
    private loginWindow: LoginWindowService,
  ) {
    auth.isLoggedIn.subscribe();
  }

  showLogin() {
    this.loginWindow.show();
  }
}
