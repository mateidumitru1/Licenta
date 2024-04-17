import {Component, OnDestroy, OnInit} from '@angular/core';
import {HomeService} from "./home.service";
import {Router, RouterLink} from "@angular/router";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {LoadingComponent} from "../../shared/loading/loading.component";
import {IdentityService} from "../../identity/identity.service";
import {MdbCarouselModule} from "mdb-angular-ui-kit/carousel";
import {HeaderService} from "../header/header.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgForOf,
    NgOptimizedImage,
    LoadingComponent,
    NgIf,
    MdbCarouselModule,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  private homeEventsSubscription: Subscription | undefined;
  private locationSubscription: Subscription | undefined;

  selectedEvents: any[] = [];
  recommendedEvents: any[] = [];
  locations: any[] = [];

  constructor(private homeService: HomeService,
              private identityService: IdentityService,
              private headerService: HeaderService) {}

  async ngOnInit() {
    await this.homeService.fetchHomeEvents();
    this.homeEventsSubscription = this.homeService.getHomeEvents().subscribe((homeEvents: any) => {
      this.selectedEvents = homeEvents.selectedEvents;
      this.recommendedEvents = homeEvents.recommendedEvents;
    });
    this.locationSubscription = this.headerService.getLocations().subscribe((locations: any) => {
      this.locations = locations;
    });
  }

  ngOnDestroy() {
    this.homeEventsSubscription?.unsubscribe();
    this.locationSubscription?.unsubscribe();
  }

  isLoggedIn() {
    return this.identityService.isLoggedIn();
  }
}
