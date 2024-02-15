import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {LocationService} from "./location.service";
import {error} from "@angular/compiler-cli/src/transformers/util";

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit{

  location: {
    id: string;
    name: string;
    address: string;
    imageUrl: string;
    eventList: [
      {
        id: string;
        title: string;
        shortDescription: string;
        description: string;
        date: string;
        imageUrl: string;
      }];
  } | undefined;

  constructor(private route: ActivatedRoute, private router: Router, private locationService: LocationService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(queryParams => {
      if(!queryParams['id']) {
        this.router.navigate(['/page-not-found']);
      }
      this.locationService.fetchLocationWithAvailableEventsById(queryParams['id']).subscribe((location: any) => {
        this.location = location;
        this.location?.eventList.sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
      }, error => {
        if(error.status === 404 && error.error === 'Location not found') {
          this.router.navigate(['/page-not-found']);
        }
      });
    });
  }

  onEventClick(event: any) {
    this.router.navigate(['/' + this.location?.name + '/' + event.title + '/' + event.id]);
  }

  fetchArchivedEvents() {
    this.route.queryParams.subscribe(queryParams => {
      if (!queryParams['id']) {
        this.router.navigate(['/page-not-found']);
      }
      this.locationService.fetchArchivedEvents(queryParams['id']).subscribe((location: any) => {
        this.location = location
        this.location?.eventList.sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
      }, error => {
        if (error.status === 404 && error.error === 'Location not found') {
          this.router.navigate(['/page-not-found']);
        }
      });
    });
  }
}
