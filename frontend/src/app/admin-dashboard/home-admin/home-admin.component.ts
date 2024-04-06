import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {HomeAdminService} from "./home-admin.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {AddSelectedEventComponent} from "./add-selected-event/add-selected-event.component";
import {LoadingComponent} from "../../shared/loading/loading.component";

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    LoadingComponent
  ],
  templateUrl: './home-admin.component.html',
  styleUrl: './home-admin.component.scss'
})
export class HomeAdminComponent implements OnInit {
  selectedEventList: any = [];
  constructor(private homeAdminService: HomeAdminService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  ngOnInit() {
    this.homeAdminService.fetchSelectedEvents().subscribe({
      next: (selectedEventList: any) => {
        this.selectedEventList = selectedEventList;
      },
      error: (error: any) => {
        this.snackBar.open('Error fetching selected events', 'Close', {duration: 3000});
      }
    });
  }

  addTopEvent() {
    let dialogRef = this.dialog.open(AddSelectedEventComponent, {
      width: '60%'
    });
    dialogRef.afterClosed().subscribe((eventList: any) => {
      if(eventList.length > 0) {
        this.homeAdminService.addSelectedEventList(eventList).subscribe({
          next: (selectedEventList: any) => {
            this.selectedEventList.push(...selectedEventList);
            this.snackBar.open('Selected event added', 'Close', {duration: 3000});
          },
          error: (error: any) => {
            if(error.status === 409 && error.error === 'Selected event already exists') {
              this.snackBar.open(error.error, 'Close', {duration: 3000});
            }
            else {
              this.snackBar.open('Error adding selected events', 'Close', {duration: 3000});
            }
          }
        });
      }
    });
  }

  deleteTopEvent(selectedEvent: any) {
    this.homeAdminService.deleteSelectedEvent(selectedEvent.id).subscribe({
      next: () => {
        this.selectedEventList = this.selectedEventList.filter((event: any) => event.id !== selectedEvent.id);
        this.snackBar.open('Selected event deleted', 'Close', {duration: 3000});
      },
      error: (error: any) => {
        this.snackBar.open('Error deleting selected event', 'Close', {duration: 3000});
      }
    });
  }
}
