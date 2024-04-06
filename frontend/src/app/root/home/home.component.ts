import {Component, OnInit} from '@angular/core';
import {HomeService} from "./home.service";
import {Router} from "@angular/router";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {LoadingComponent} from "../../shared/loading/loading.component";
import {IdentityService} from "../../identity/identity.service";

@Component({
  selector: 'app-home',
  standalone: true,
    imports: [
        NgForOf,
        NgOptimizedImage,
        LoadingComponent,
        NgIf
    ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  selectedEvents: any[] = [];
  recommendedEvents: any[] = [];
  locations: any[] = [];

  isLoggedIn = false;

  constructor(private homeService: HomeService, private identityService: IdentityService, private router: Router) {}

  ngOnInit(): void {
    if (this.identityService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.homeService.fetchRecommendedEvents().subscribe({
        next: (events: any) => {
          this.recommendedEvents = events;
          console.log('Recommended events', events);
        },
        error: (error: any) => {
          console.error('Error fetching recommended events', error);
        }
      });
    }
    this.homeService.fetchSelectedEvents().subscribe({
      next: (events: any) => {
        this.selectedEvents = events;
      },
      error: (error: any) => {
        console.error('Error fetching selected events', error);
      }
    });
  }

  onEventClick(selectedEvent: any) {
    this.router.navigate(['/', selectedEvent.location.name, selectedEvent.title], {
      queryParams: {id: selectedEvent.id}
    });
  }
}
