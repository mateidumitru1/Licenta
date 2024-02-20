import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AddEditUserComponent} from "../../../manage-users/popups/add-edit-user/add-edit-user.component";
import {ManageLocationsService} from "../../../manage-locations/manage-locations.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MdbFormsModule} from "mdb-angular-ui-kit/forms";
import {NgForOf, NgIf} from "@angular/common";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from "@angular/material/table";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";

@Component({
  selector: 'app-add-ticket-type',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MdbFormsModule,
    NgIf,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatIconButton,
    MatRow,
    MatRowDef,
    MatTable,
    NgForOf
  ],
  templateUrl: './add-ticket-type.component.html',
  styleUrl: './add-ticket-type.component.scss'
})
export class AddTicketTypeComponent {
  registrationForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<AddTicketTypeComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder) {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      quantity: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
    });
  }

  onCloseClick() {
    this.dialogRef.close();
  }

  onConfirmClick() {
    this.registrationForm.markAllAsTouched();
    if(this.registrationForm.valid) {
      this.dialogRef.close(this.registrationForm.value);
    }
  }
}
