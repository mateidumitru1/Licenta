import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {
  AddEditUserComponent
} from "../../../admin-dashboard/manage/manage-users/popups/add-edit-user/add-edit-user.component";
import {ValidateService} from "./validate.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LoadingComponent} from "../../../shared/loading/loading.component";
import {DatePipe, NgIf} from "@angular/common";

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
export class ValidateComponent implements OnInit{
  ticket: any = {};

  constructor(private validateService: ValidateService, public dialogRef: MatDialogRef<ValidateComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.validateService.validateTicket(this.data).subscribe({
      next: (ticket: any) => {
        this.ticket = ticket;
        console.log(ticket);
      },
      error: (error: any) => {
        this.snackBar.open(error.error, 'Close', {duration: 3000});
      }
    });
  }

  onCloseClick() {
    this.dialogRef.close();
  }
}
