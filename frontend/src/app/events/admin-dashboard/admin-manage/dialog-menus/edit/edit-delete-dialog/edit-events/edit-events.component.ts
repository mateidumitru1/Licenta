import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {LocationService} from "../../../../../../location/location.service";
import {EventService} from "../../../../../../event/event.service";
import {forkJoin} from "rxjs";
import {TicketTypeService} from "../../../ticket-type-table/ticket-type.service";

@Component({
  selector: 'app-edit-events',
  templateUrl: './edit-events.component.html',
  styleUrls: ['./edit-events.component.css']
})
export class EditEventsComponent implements OnInit{

  @Input() eventId: any = {};

  @Input() dialogRef: any = {};

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

  toEditData: any = {};

  locations: any[] = [];

  imageSrc: string | ArrayBuffer | null = null;

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  constructor(private eventService: EventService, private locationService: LocationService,
              private ticketTypeService: TicketTypeService) {}

  ngOnInit() {
    forkJoin([
      this.eventService.fetchEvent(this.eventId),
      this.locationService.fetchAllLocations(),
    ]).subscribe(
      ([event, locations]) => {
        this.event = event;
        this.locations = locations;
        this.toEditData = { ...this.event };
      });

    this.ticketTypeService.subject.subscribe((ticketTypes) => {
      this.toEditData.ticketTypes = ticketTypes;
      console.log(this.toEditData.ticketTypes);
    });
  }

  onCancelButtonClick() {
    this.imageSrc = null;
    this.toEditData.image = null;
    this.fileInput.nativeElement.value = '';
  }

  onFileSelected(event: any) {
    this.toEditData.image = event.target.files[0];

    if (this.toEditData.image) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageSrc = reader.result;
      };
      reader.readAsDataURL(this.toEditData.image);
    }
  }
}
