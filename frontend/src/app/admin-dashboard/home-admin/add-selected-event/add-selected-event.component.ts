import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {LoadingComponent} from "../../../shared/loading/loading.component";
import {HomeAdminService} from "../home-admin.service";
import {Subscription} from "rxjs";

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
export class AddSelectedEventComponent implements OnInit, OnDestroy {
  private eventListSubscription: Subscription | undefined;

  eventList: any[] = [];
  filteredEventList: any[] = [];
  searchText: string = '';

  constructor(private homeAdminService: HomeAdminService, private dialogRef: MatDialogRef<AddSelectedEventComponent>) {}

  async ngOnInit() {
    await this.homeAdminService.fetchEventListForSelection();
    this.eventListSubscription = this.homeAdminService.getEventListForSelection().subscribe((eventList: any) => {
      this.eventList = eventList;
      this.filteredEventList = eventList;
    });
  }

  ngOnDestroy() {
    this.eventListSubscription?.unsubscribe();
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
