import {Component, OnInit} from '@angular/core';
import {HomeService} from "./home.service";
import {Router} from "@angular/router";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {LoadingComponent} from "../../shared/loading/loading.component";

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
