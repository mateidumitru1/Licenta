import {Component, OnInit} from '@angular/core';
import {EventService} from "../../event/event.service";
import {AdminHomeService} from "./admin-home.service";
import {MatDialog} from "@angular/material/dialog";
import {AddTopEventDialogComponent} from "./add-top-event-dialog/add-top-event-dialog.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit{

  topEventList: any[] = [];

  constructor(private eventService: EventService, private adminHomeService: AdminHomeService, private dialog: MatDialog,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.adminHomeService.getTopEvents().subscribe((topEventList: any) => {
      this.topEventList = topEventList;
    }, (error) => {
      this.snackBar.open('Error fetching top events', 'Close', {duration: 3000});
    });
  }

  addTopEvent() {
    this.dialog.open(AddTopEventDialogComponent, {
      width: '1000px',
      height: '400px'
    }).afterClosed().subscribe((topEventList: any) => {
      if (topEventList) {
        const eventIds = topEventList.map((event: any) => {
          return {
            eventId: event.id,
            customDescription: ''
          };
        });
        this.adminHomeService.addTopEventList(eventIds).subscribe((topEventList: any) => {
          this.topEventList.push(...topEventList);
        }, (error) => {
          if(error.status === 409 && error.error === 'Top event already exists') {
            this.snackBar.open(error.error, 'Close', {duration: 3000});
          }
          else {
            this.snackBar.open('Error adding top events', 'Close', {duration: 3000});
          }
        });
      }
    });
  }

  deleteTopEvent(event: any) {
    this.adminHomeService.deleteTopEvent(event.id).subscribe((topEventList: any) => {
      this.topEventList.splice(this.topEventList.indexOf(event), 1);
      this.snackBar.open('Top event deleted', 'Close', {duration: 3000});
    }, (error) => {
      this.snackBar.open('Error deleting top event', 'Close', {duration: 3000});
    });
  }
}
