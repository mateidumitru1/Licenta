import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {debounceTime, Subscription} from "rxjs";
import {ActivatedRoute, NavigationStart, Router, RouterLink} from "@angular/router";
import {LocationService} from "../location/location.service";
import {LoadingService} from "../../shared/loading/loading.service";
import {EventService} from "./event.service";
import {MatDialog} from "@angular/material/dialog";
import {EventListFilterComponent} from "./event-list-filter/event-list-filter.component";

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    NgIf
  ],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss'
})
export class EventListComponent implements OnInit, OnDestroy {
  private eventListSubscription: Subscription | undefined;
  private loadingSubscription: Subscription | undefined;

  events: any = [];
  page = 0;
  size = 10;
  loading = false;
  reachedEnd = false;

  locationNameList: string | undefined;
  artistNameList: string | undefined;
  genreNameList: string | undefined;
  startDate: string | undefined;
  endDate: string | undefined;

  filter!: {
    location: string[] | undefined,
    artist: string[] | undefined,
    genre: string[] | undefined,
    startDate: string | undefined,
    endDate: string | undefined
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private loadingService: LoadingService,
    private dialog: MatDialog
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
      this.locationNameList = params['location'];
      this.artistNameList = params['artist'];
      this.genreNameList = params['genre'];
      this.startDate = params['startDate'];
      this.endDate = params['endDate'];

      this.filter = {
        location: this.locationNameList?.split(','),
        artist: this.artistNameList?.split(','),
        genre: this.genreNameList?.split(','),
        startDate: this.startDate,
        endDate: this.endDate
      }

      await this.eventService.fetchEventList(this.locationNameList, this.artistNameList, this.genreNameList, this.startDate, this.endDate, this.page, this.size);
      this.eventListSubscription = this.eventService.getEventList().subscribe((response: any) => {
        this.events = response.content;
        this.page++;
        if (this.events?.length < this.size) {
          this.reachedEnd = true;
        }
      });
    });
  }

  ngOnDestroy() {
    this.loadingSubscription?.unsubscribe();
    this.eventListSubscription?.unsubscribe();
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
    const responseLength = await this.eventService.fetchEventList(this.locationNameList, this.artistNameList, this.genreNameList, this.startDate, this.endDate, this.page, this.size);
    if (responseLength < this.size) {
      this.reachedEnd = true;
    }
    this.page++;
  }

  openFilterMenu() {
    const dialogRef = this.dialog.open(EventListFilterComponent, {
      width: '60%',
      height: '70%',
      data: {
        location: this.locationNameList,
        artist: this.artistNameList,
        genre: this.genreNameList,
        startDate: this.startDate,
        endDate: this.endDate
      }
    });
    dialogRef.afterClosed().subscribe((response: any) => {
      if (response === undefined) {
        return;
      }
      let params = {
        location: response.selectedLocations.join(',') || null,
        artist: response.selectedArtists.join(',') || null,
        genre: response.selectedGenres.join(',') || null,
        startDate: response.selectedStartDate || null,
        endDate: response.selectedEndDate || null
      };
      this.router.navigate(['/events'], {queryParams: params});
    });
  }

  removeFilter(type: string, data: string) {
    let params = {
      location: type === 'location' ? (this.locationNameList?.split(',').filter(location => location !== data).join(',') || null) : this.locationNameList,
      artist: type === 'artist' ? (this.artistNameList?.split(',').filter(artist => artist !== data).join(',') || null) : this.artistNameList,
      genre: type === 'genre' ? (this.genreNameList?.split(',').filter(genre => genre !== data).join(',') || null) : this.genreNameList,
      startDate: type === 'date' ? null : this.startDate,
      endDate: type === 'date' ? null : this.endDate
    };

    this.router.navigate(['/events'], {queryParams: params});
  }
}
