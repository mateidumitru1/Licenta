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

  constructor(private route: ActivatedRoute, private trackEventService: TrackEventService,
              private snackBar: MatSnackBar, private mapDialog: MatDialog) {}

  async ngOnInit() {
    await this.trackEventService.fetchTicketsByEventId(this.route.snapshot.queryParams['id']);
    this.trackEventService.getTickets().subscribe({
      next: (tickets: any) => {
        this.tickets = tickets;
        this.event = tickets[0].ticketType.event;
      }
    });
  }

  displayQR(ticket: any) {
    ticket.shouldDisplayQR = !ticket.shouldDisplayQR;
  }

  showMap() {
    const destination = [this.event.location.longitude, this.event.location.latitude];
    const dialogRef = this.mapDialog.open(MapComponent, {
      width: '80%',
      height: '80%',
      data: {
        destination: destination
      }
    });

    dialogRef.afterClosed();
  }
}
