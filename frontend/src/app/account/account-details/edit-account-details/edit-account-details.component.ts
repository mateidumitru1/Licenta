import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MdbFormsModule} from "mdb-angular-ui-kit/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-edit-account-details',
  standalone: true,
  imports: [
    FormsModule,
    MdbFormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './edit-account-details.component.html',
  styleUrl: './edit-account-details.component.scss'
})
export class EditAccountDetailsComponent {
  form: FormGroup;
  user: any = {};
  constructor(private dialogRef: MatDialogRef<EditAccountDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder) {
    this.form = this.fb.group({
      firstName: [data.firstName, Validators.required],
      lastName: [data.lastName, Validators.required],
      email: [data.email, [Validators.required, Validators.email]]
    });
  }

  onCloseClick() {
    this.dialogRef.close();
  }

  onConfirmClick() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      let user = {... this.form.value, id: this.data.id, username: this.data.username, role: this.data.role};
      this.dialogRef.close(user);
    }
  }
}
