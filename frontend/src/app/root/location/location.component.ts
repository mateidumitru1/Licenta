import {Component, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationStart, Router, RouterLink} from "@angular/router";
import {LocationService} from "./location.service";
import {NgForOf, NgIf} from "@angular/common";
import {LoadingComponent} from "../../shared/loading/loading.component";
import {LoadingService} from "../../shared/loading/loading.service";

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
export class LocationComponent implements OnInit{
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
    this.loadingService.loading$.subscribe(loading => {
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

    this.route.queryParams.subscribe(params => {
      const locationId = params['id'];
      if (!locationId) {
        this.router.navigate(['/page-not-found']);
        return;
      }

      this.locationService.fetchInitialEventsByLocationId(locationId, this.page, this.size).subscribe({
        next: (events: any) => {
          if (events.length < this.size) {
            this.reachedEnd = true;
          }
          this.location = events.content[0].location;
          this.events = events.content;
          this.page++;
        },
        error: (error: any) => {
          this.router.navigate(['/page-not-found']);
        }
      });
    });
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any): void {
    const bottomOffset = 20;
    const windowHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;

    if (!this.reachedEnd && !this.loading && scrollTop + windowHeight >= scrollHeight - bottomOffset) {
      this.loadMoreEvents();
    }
  }

  loadMoreEvents(): void {
    this.locationService.fetchMoreEventsByLocationId(this.location.id, this.page, this.size).subscribe({
      next: (events: any) => {
        if (events.content.length < 10) {
          this.reachedEnd = true;
        }
        this.events = [...this.events, ...events.content];
        this.page++;
      },
      error: (error: any) => {
        console.error('Error loading more events:', error);
      }
    });
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
