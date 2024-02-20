import { Component } from '@angular/core';
import {HomeService} from "./home.service";
import {Router} from "@angular/router";
import {NgForOf, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgForOf,
    NgOptimizedImage
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  topEvents: any[] = [];

  constructor(private homeService: HomeService, private router: Router) {
  }
  ngOnInit(): void {
    this.homeService.fetchTopEvents().subscribe({
      next: (events: any) => {
        this.topEvents = events;
      },
      error: (error: any) => {
        console.error('Error fetching top events', error);
      }
    });
  }

  onEventClick(topEvent: any) {
    this.router.navigate(['/', topEvent.event.location.name, topEvent.event.title], {
      queryParams: {id: topEvent.event.id}
    });
  }
}
