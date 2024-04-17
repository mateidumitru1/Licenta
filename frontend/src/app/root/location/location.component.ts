import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationStart, Router, RouterLink} from "@angular/router";
import {LocationService} from "./location.service";
import {NgForOf, NgIf} from "@angular/common";
import {LoadingComponent} from "../../shared/loading/loading.component";
import {LoadingService} from "../../shared/loading/loading.service";
import {debounceTime, Subscription} from "rxjs";

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [
    NgForOf,
    LoadingComponent,
    NgIf,
    RouterLink
  ],
  templateUrl: './location.component.html',
  styleUrl: './location.component.scss'
})
export class LocationComponent implements OnInit, OnDestroy {
  private locationSubscription: Subscription | undefined;
  private loadingSubscription: Subscription | undefined;
  private moreEventsSubscription: Subscription | undefined;

  location: any = {};
  events: any = [];
  page = 0;
  size = 10;
  loading = false;
  reachedEnd = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private locationService: LocationService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadingSubscription = this.loadingService.loading$.subscribe(loading => {
      setTimeout(() => {
        this.loading = loading;
      }, 0);
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.reachedEnd = false;
        this.page = 0;
      }
    });

    this.route.queryParams.subscribe(async (params) => {
      const locationId = params['id'];
      if (!locationId) {
        await this.router.navigate(['/page-not-found']);
        return;
      }

      await this.locationService.fetchLocationWithInitialEventsByLocationId(locationId, this.page, this.size);
      this.locationSubscription = this.locationService.getLocation().subscribe((location: any) => {
        this.location = location;
        this.events = location.eventPage?.content;
        this.page++;
        if (this.events?.length < this.size) {
          this.reachedEnd = true;
        }
      });
    });
  }

  ngOnDestroy() {
    this.loadingSubscription?.unsubscribe();
    this.locationSubscription?.unsubscribe();
    this.moreEventsSubscription?.unsubscribe();
  }

  @HostListener('window:scroll', ['$event'])
  async onWindowScroll() {
    const bottomOffset = 20;
    const windowHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;

    if (!this.reachedEnd && !this.loading && scrollTop + windowHeight >= scrollHeight - bottomOffset) {
      await this.loadMoreEvents();
    }
  }

  async loadMoreEvents() {
    await this.locationService.fetchMoreEventsByLocationId(this.location.id, this.page, this.size);

    this.moreEventsSubscription = this.locationService.getMoreEvents().pipe(
      debounceTime(10)
    ).subscribe((events: any) => {
      if (events.content) {
        if (events.content?.length < this.size) {
          this.reachedEnd = true;
        }
        this.events = [...this.events, ...events.content];
        this.page++;
      }
    });
  }
}
