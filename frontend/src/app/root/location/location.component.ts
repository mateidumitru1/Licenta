import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {LocationService} from "./location.service";
import {NgForOf, NgIf} from "@angular/common";
import {LoadingComponent} from "../../shared/loading/loading.component";

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [
    NgForOf,
    LoadingComponent,
    NgIf
  ],
  templateUrl: './location.component.html',
  styleUrl: './location.component.scss'
})
export class LocationComponent implements OnInit{
  loading: boolean = true;

  location: any = {};
  constructor(private route: ActivatedRoute, private router: Router, private locationService: LocationService) {}

  ngOnInit() {
    if(!this.route.snapshot.queryParams['id']) {
      this.router.navigate(['/page-not-found']);
    }
    this.locationService.fetchLocationWithAvailableEventsById(this.route.snapshot.queryParams['id']).subscribe({
      next: (location: any) => {
        this.location = location;
      },
      error: (error: any) => {
        if(error.status === 404 && error.error === 'Location not found') {
          this.router.navigate(['/page-not-found']);
        }
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  onEventClick(event: any) {
    this.router.navigate(['/', this.location.name, event.title], {
      queryParams: {id: event.id}
    });
  }
}
