import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {EventService} from "./event.service";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  event: {
    id: string;
    title: string;
    shortDescription: string;
    description: string;
    date: string;
    place: {
      id: string;
      name: string;
      address: string;
      imageUrl: string;
    };
    imageUrl: string;
  } = {
    id: '',
    title: '',
    shortDescription: '',
    description: '',
    date: '',
    place: {
      id: '',
      name: '',
      address: '',
      imageUrl: ''
    },
    imageUrl: ''
  };

  showMoreDetails: boolean = false;

  constructor(private eventService: EventService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.eventService.fetchEvent(this.route.snapshot.params['eventId']).subscribe((event: any) => {
      this.event = event;
    });
  }
}
