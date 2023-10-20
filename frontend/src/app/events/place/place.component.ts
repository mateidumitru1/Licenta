import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {PlaceEventsService} from "./place-events.service";

@Component({
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.css']
})
export class PlaceComponent implements OnInit{

  place: {
    id: string;
    name: string;
    address: string;
    imageUrl: string;
    events: [
      {
        id: string;
        title: string;
        shortDescription: string;
        description: string;
        date: string;
        imageUrl: string;
      }];
  } | undefined;

  constructor(private route: ActivatedRoute, private router: Router, private placeEventsService: PlaceEventsService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.placeEventsService.fetchEvents(params['place']).subscribe((place: any) => {
        this.place = place;
      }, error => {
        console.log(error);
      });
    });
  }

  onEventClick(event: any) {
    this.router.navigate(['/' + event.place.name + '/' + event.title]);
  }
}
