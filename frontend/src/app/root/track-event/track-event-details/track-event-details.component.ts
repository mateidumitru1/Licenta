import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {TrackEventService} from "../track-event.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {NgForOf, NgIf} from "@angular/common";
import {MapComponent} from "./map/map.component";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-track-event-details',
  standalone: true,
  imports: [
    NgIf,
    MatButton,
    NgForOf
  ],
  templateUrl: './track-event-details.component.html',
  styleUrl: './track-event-details.component.scss'
})
export class TrackEventDetailsComponent implements OnInit{

  tickets: any[] = [];

  event: any = {};

  destination: [number, number] = [0, 0];

  constructor(private route: ActivatedRoute, private trackEventService: TrackEventService,
              private snackBar: MatSnackBar, private mapDialog: MatDialog) {}

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
