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
      id: string;
      name: string;
      price: number;
      quantity: number;
      event: any;
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

  currentDate = new Date();
  eventDate = new Date(this.event.date);

  showMoreDetails: boolean = false;

  constructor(private eventService: EventService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.eventService.fetchEvent(this.route.snapshot.params['eventId']).subscribe((event: any) => {
      this.event = event;
      this.event.ticketTypes.sort((a, b) => b.price - a.price);
      var dateParts = this.event.date.split("-");
      this.eventDate = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));
    }, error => {
      this.router.navigate(['/page-not-found']);
    });

  }
}
