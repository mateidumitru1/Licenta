import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatInputModule} from "@angular/material/input";
import {EventService} from "../../../event/event.service";
import {MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormsModule} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-add-top-event-dialog',
  standalone: true,
  imports: [CommonModule, MatInputModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './add-top-event-dialog.component.html',
  styleUrl: './add-top-event-dialog.component.css'
})
export class AddTopEventDialogComponent implements OnInit{

  searchText: string = '';

  eventList: any[] = [];

  selectedEventList: any[] = [];
  constructor(private eventService: EventService, private snackBar: MatSnackBar, private dialogRef: MatDialogRef<AddTopEventDialogComponent>) {
  }

  ngOnInit(): void {
    this.eventService.fetchAllEvents().subscribe((eventList: any) => {
      this.eventList = eventList;
    }, (error) => {
      this.snackBar.open('Error fetching events', 'Close', {
        duration: 3000,
      });
    });
    this.eventList.forEach((event: any) => {
      event.selected = false;
    });
  }

  searchEvent() {
    this.eventList.filter((event: any) => {
      return event.name.toLowerCase().includes(this.searchText.toLowerCase());
    });
  }

  onConfirmClick() {
    var eventListToReturn = this.eventList.filter((event: any) => {
      return event.selected;
    });
    eventListToReturn.forEach((event: any) => {
      delete event.selected;
    });
    this.dialogRef.close(eventListToReturn);
  }

  onCardClick(event: any) {
    event.selected = !event.selected;
  }
}
