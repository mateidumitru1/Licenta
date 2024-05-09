import {Injectable, OnInit} from "@angular/core";
import {BehaviorSubject, filter} from "rxjs";
import {NavigationEnd, NavigationStart, Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class LoadingService implements OnInit {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe(() => {
      this.show();
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.hide();
    });
  }

  show() {
    this.loadingSubject.next(true);
  }

  hide() {
    this.loadingSubject.next(false);
  }
}
