import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {LocationService} from "./location.service";

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

  constructor(private route: ActivatedRoute, private router: Router, private placeEventsService: LocationService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(queryParams => {
      this.placeEventsService.fetchEvents(queryParams['id']).subscribe((location: any) => {
        this.location = location;
      }, error => {
        this.router.navigate(['/page-not-found']);
      });
    });
  }

  onEventClick(event: any) {
    this.router.navigate(['/' + this.location?.name + '/' + event.title + '/' + event.id]);
  }
}
