import { Component, OnInit, OnDestroy, inject } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { Subject } from "rxjs";
import {
  takeUntil,
  filter,
  debounceTime,
  distinctUntilChanged,
  startWith,
} from "rxjs/operators";

@Component({
  selector: "sd-search",
  templateUrl: "search.html",
  imports: [ReactiveFormsModule],
})
export class SearchComponent implements OnInit, OnDestroy {
  private router = inject(Router);

  query = new FormControl();

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        filter((e) => e instanceof NavigationEnd),
      )
      .subscribe((_) => this.setQueryFromRoute());

    this.query.valueChanges
      .pipe(
        startWith(""),
        takeUntil(this.destroy$),
        debounceTime(200),
        filter((q: string) => q.length === 0 || q.length > 2),
        distinctUntilChanged(),
      )
      .subscribe((q) => this.navigateToSearch(q));
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  private navigateToSearch(q: string): void {
    if (q.length) {
      this.router.navigate(["search", q]);
    } else if (this.isSearchRoute) {
      this.router.navigate(["/"]);
    }
  }

  private setQueryFromRoute(): void {
    const searchRoute = this.searchRoute;
    if (searchRoute && searchRoute.snapshot.params) {
      const query = searchRoute.snapshot.params["query"];
      this.query.setValue(query ? query : "");
    }
  }

  private get isSearchRoute(): boolean {
    const searchRoute = <any>this.searchRoute;
    return (
      searchRoute &&
      searchRoute.url.value.length &&
      searchRoute.url.value[0].path === "search"
    );
  }

  private get searchRoute(): ActivatedRoute {
    const state = this.router.routerState as any;
    return state.firstChild(state.root);
  }
}
