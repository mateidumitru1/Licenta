import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {PlaceEventsService} from "./place-events.service";

@Component({
  selector: 'app-place-events',
  templateUrl: './place-events.component.html',
  styleUrls: ['./place-events.component.css']
})
export class PlaceEventsComponent implements OnInit{

  events: {
    id: string,
    title: string,
    shortDescription: string,
    description: string,
    date: string,
    place: {
      id: string,
      name: string,
      address: string,
      imageUrl: string
    },
    imageUrl: string
  }[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private placeEventsService: PlaceEventsService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.placeEventsService.fetchEvents(params['place']);
      this.events = this.placeEventsService.getEvents();
    });
  }

  onEventClick(event: any) {
    this.router.navigate(['/' + event.place.name + '/' + event.title]);
  }
}
