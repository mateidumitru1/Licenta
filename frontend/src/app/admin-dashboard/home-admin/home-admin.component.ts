import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {HomeAdminService} from "./home-admin.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {AddTopEventComponent} from "./add-top-event/add-top-event.component";
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
  loading: boolean = true;

  topEventList: any = [];
  constructor(private homeAdminService: HomeAdminService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  ngOnInit() {
    this.homeAdminService.fetchTopEvents().subscribe({
      next: (topEventList: any) => {
        this.topEventList = topEventList;
      },
      error: (error: any) => {
        this.snackBar.open('Error fetching top events', 'Close', {duration: 3000});
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  addTopEvent() {
    let dialogRef = this.dialog.open(AddTopEventComponent, {
      width: '60%'
    });
    dialogRef.afterClosed().subscribe((eventList: any) => {
      if(eventList) {
        this.homeAdminService.addTopEventList(eventList).subscribe({
          next: (topEventList: any) => {
            this.topEventList.push(...topEventList);
            this.snackBar.open('Top event added', 'Close', {duration: 3000});
          },
          error: (error: any) => {
            if(error.status === 409 && error.error === 'Top event already exists') {
              this.snackBar.open(error.error, 'Close', {duration: 3000});
            }
            else {
              this.snackBar.open('Error adding top events', 'Close', {duration: 3000});
            }
          }
        });
      }
    });
  }

  deleteTopEvent(topEvent: any) {
    this.homeAdminService.deleteTopEvent(topEvent.id).subscribe({
      next: () => {
        this.topEventList = this.topEventList.filter((event: any) => event.id !== topEvent.id);
        this.snackBar.open('Top event deleted', 'Close', {duration: 3000});
      },
      error: (error: any) => {
        this.snackBar.open('Error deleting top event', 'Close', {duration: 3000});
      }
    });
  }
}
