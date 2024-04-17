import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {HomeAdminService} from "./home-admin.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {AddSelectedEventComponent} from "./add-selected-event/add-selected-event.component";
import {LoadingComponent} from "../../shared/loading/loading.component";
import {Subscription} from "rxjs";

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
export class HomeAdminComponent implements OnInit, OnDestroy {
  private selectedEventListSubscription: Subscription | undefined;

  selectedEventList: any = [];
  constructor(private homeAdminService: HomeAdminService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  async ngOnInit() {
    await this.homeAdminService.fetchSelectedEvents();
    this.selectedEventListSubscription = this.homeAdminService.getSelectedEventList().subscribe((selectedEventList: any) => {
      this.selectedEventList = selectedEventList;
    });
  }

  ngOnDestroy() {
    this.selectedEventListSubscription?.unsubscribe();
  }

  addTopEvent() {
    let dialogRef = this.dialog.open(AddSelectedEventComponent, {
      width: '60%'
    });
    dialogRef.afterClosed().subscribe(async (eventList: any) => {
      if(eventList.length > 0) {
        await this.homeAdminService.addSelectedEventList(eventList);
      }
    });
  }

  async deleteTopEvent(selectedEvent: any) {
    await this.homeAdminService.deleteSelectedEvent(selectedEvent.id);
  }
}
