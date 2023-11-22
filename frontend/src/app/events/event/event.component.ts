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
    location: {
      id: string;
      name: string;
      address: string;
      imageUrl: string;
    };
    imageUrl: string;
    ticketTypes: {
      name: string;
      price: number;
      quantity: number;
    }[];
  } = {
    id: '',
    title: '',
    shortDescription: '',
    description: '',
    date: '',
    location: {
      id: '',
      name: '',
      address: '',
      imageUrl: ''
    },
    ticketTypes: [],
    imageUrl: ''
  };

  showMoreDetails: boolean = false;

  constructor(private eventService: EventService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.eventService.fetchEvent(this.route.snapshot.params['eventId']).subscribe((event: any) => {
      this.event = event;
      this.event.ticketTypes.sort((a, b) => b.price - a.price);
    }, error => {
      this.router.navigate(['/page-not-found']);
    });
  }
}
