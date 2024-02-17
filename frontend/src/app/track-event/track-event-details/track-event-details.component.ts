import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute} from "@angular/router";
import {TrackEventService} from "../track-event.service";
import {MatButtonModule} from "@angular/material/button";
import mapboxgl from "mapbox-gl";
import {environment} from "../../shared/environment";
import {MatDialog} from "@angular/material/dialog";
import {MapComponent} from "./map/map.component";

@Component({
  selector: 'app-track-event-details',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './track-event-details.component.html',
  styleUrl: './track-event-details.component.css'
})
export class TrackEventDetailsComponent implements OnInit{

  tickets: any[] = [];

  event: any = {};

  destination: [number, number] = [0, 0];

  constructor(private route: ActivatedRoute, private trackEventService: TrackEventService, private snackBar: MatSnackBar,
              private mapDialog: MatDialog) {}

  ngOnInit() {

    this.trackEventService.fetchTicketsByEventId(this.route.snapshot.queryParams['id']).subscribe((tickets: any) => {
      this.tickets = tickets;
      this.tickets.forEach((ticket: any) => {
        ticket.shouldDisplayQR = false;
      });
      this.event = tickets[0].ticketType.event;
      this.destination = [this.event.location.longitude, this.event.location.latitude];

    }, (error) => {
      this.snackBar.open('Error fetching tickets', 'Close', {duration: 3000});
    });
  }

  displayQR(ticket: any) {
    ticket.shouldDisplayQR = !ticket.shouldDisplayQR;
  }

  showMap() {
    const dialogRef = this.mapDialog.open(MapComponent, {
      width: '80%',
      height: '80%',
      data: {
        destination: this.destination
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
