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
  templateUrl: './add-selected-event.component.html',
  styleUrl: './add-selected-event.component.scss'
})
export class AddSelectedEventComponent implements OnInit {
  eventList: any[] = [];
  filteredEventList: any[] = [];
  searchText: string = '';

  constructor(private manageEventsService: ManageEventsService, private snackBar: MatSnackBar, private dialogRef: MatDialogRef<AddSelectedEventComponent>) {}

  ngOnInit() {
    this.manageEventsService.fetchEventForSelection().subscribe({
      next: (eventList: any) => {
        this.eventList = eventList.map((event: any) => ({...event, toBeSelected: false}));
        this.filteredEventList = [...this.eventList];
      },
      error: (error: any) => {
        this.snackBar.open('Error fetching events', 'Close', { duration: 3000 });
      }
    });
  }

  searchEvent() {
    this.filteredEventList = this.eventList.filter(event => event.title.toLowerCase().includes(this.searchText.toLowerCase()));
  }

  onConfirmClick() {
    const eventListToReturn = this.eventList.filter(event => event.toBeSelected).map(event => event.id);
    this.dialogRef.close(eventListToReturn);
  }

  onCardClick(event: any) {
    if(event.selected === null || event.selected === false) {
      event.toBeSelected = !event.toBeSelected;
    }
  }

  onCloseClick() {
    this.dialogRef.close();
  }
}
