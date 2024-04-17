import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {
  AddEditUserComponent
} from "../../../admin-dashboard/manage/manage-users/popups/add-edit-user/add-edit-user.component";
import {ValidateService} from "./validate.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LoadingComponent} from "../../../shared/loading/loading.component";
import {DatePipe, NgIf} from "@angular/common";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-validate',
  standalone: true,
  imports: [
    LoadingComponent,
    NgIf,
    DatePipe
  ],
  templateUrl: './validate.component.html',
  styleUrl: './validate.component.scss'
})
export class ValidateComponent implements OnInit, OnDestroy {
  private ticketSubscription: Subscription | undefined;

  ticket: any = {};

  constructor(private validateService: ValidateService, public dialogRef: MatDialogRef<ValidateComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private snackBar: MatSnackBar) {}

  async ngOnInit() {
    await this.validateService.validateTicket(this.data);
    this.ticketSubscription = this.validateService.getTicket().subscribe(ticket => {
      this.ticket = ticket;
    });
  }

  ngOnDestroy() {
    this.ticketSubscription?.unsubscribe();
  }

  onCloseClick() {
    this.dialogRef.close();
  }
}
