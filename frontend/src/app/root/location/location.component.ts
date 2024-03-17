import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {LocationService} from "./location.service";
import {NgForOf, NgIf} from "@angular/common";
import {LoadingComponent} from "../../shared/loading/loading.component";

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
  constructor(private route: ActivatedRoute, private router: Router, private locationService: LocationService) {}

  ngOnInit() {
    if(!this.route.snapshot.queryParams['id']) {
      this.router.navigate(['/page-not-found']);
    }
    this.route.queryParams.subscribe({
      next: (params: any) => {
        this.locationService.fetchLocationWithAvailableEventsById(params.id).subscribe({
          next: (location: any) => {
            this.location = location;
          },
          error: (error: any) => {
            this.router.navigate(['/page-not-found']);
          }
        });
      }
    });
  }
}
