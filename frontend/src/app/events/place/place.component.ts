import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {PlaceService} from "./place.service";

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

  constructor(private route: ActivatedRoute, private router: Router, private placeEventsService: PlaceService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(queryParams => {
      this.placeEventsService.fetchEvents(queryParams['id']).subscribe((place: any) => {
        this.place = place;
      }, error => {
        console.log(error);
      });
    });
  }

  onEventClick(event: any) {
    this.router.navigate(['/' + this.place?.name + '/' + event.title + '/' + event.id]);
  }
}
