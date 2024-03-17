import { Component, OnInit } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ManageEventsService} from "../../manage/manage-events/manage-events.service";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {LoadingComponent} from "../../../shared/loading/loading.component";

@Component({
  selector: 'app-add-top-event',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgClass,
    NgIf,
    LoadingComponent
  ],
  templateUrl: './add-top-event.component.html',
  styleUrl: './add-top-event.component.scss'
})
export class AddTopEventComponent implements OnInit {
  eventList: any[] = [];
  filteredEventList: any[] = [];
  searchText: string = '';

  constructor(private manageEventsService: ManageEventsService, private snackBar: MatSnackBar, private dialogRef: MatDialogRef<AddTopEventComponent>) {}

  ngOnInit() {
    this.manageEventsService.fetchEvents().subscribe({
      next: (eventList: any) => {
        this.eventList = eventList;
        this.filteredEventList = eventList;
      },
      error: (error: any) => {
        this.snackBar.open('Error fetching events', 'Close', {duration: 3000});
      }
    });
    this.eventList.forEach((event: any) => {
      event.selected = false;
    });
  }

  searchEvent() {
    this.filteredEventList = this.eventList.filter((event: any) => {
      return event.title.toLowerCase().includes(this.searchText.toLowerCase());
    });
  }

  onConfirmClick() {
    let eventListToReturn = this.eventList.filter((event: any) => {
      return event.selected;
    }).map((event: any) => {
      return {
        eventId: event.id,
        customDescription: ''
      };
    });
    this.dialogRef.close(eventListToReturn);
  }

  onCardClick(event: any) {
    event.selected = !event.selected;
  }

  onCloseClick() {
    this.dialogRef.close();
  }
}
