import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {MdbFormsModule} from "mdb-angular-ui-kit/forms";

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    MdbFormsModule
  ],
  templateUrl: './add-edit-user.component.html',
  styleUrl: './add-edit-user.component.scss'
})
export class AddEditUserComponent {
  registrationForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<AddEditUserComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder) {

    if(data.title == 'Adauga user') {
      this.registrationForm = this.fb.group({
        firstName: [this.data.user.firstName, Validators.required],
        lastName: [this.data.user.lastName, Validators.required],
        username: [this.data.user.username, Validators.required],
        email: [this.data.user.email, [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        role: [this.data.user.role, Validators.required]
      });
    }
    else {
      this.registrationForm = this.fb.group({
        firstName: [this.data.user.firstName, Validators.required],
        lastName: [this.data.user.lastName, Validators.required],
        username: [this.data.user.username, Validators.required],
        email: [this.data.user.email, [Validators.required, Validators.email]],
        role: [this.data.user.role, Validators.required]
      });
    }
  }

  onCloseClick() {
    this.dialogRef.close();
  }

  onConfirmClick() {
    this.registrationForm.markAllAsTouched();
    if(this.registrationForm.valid) {
      const user = {... this.registrationForm.value, id: this.data.user.id};
      this.dialogRef.close(user);
    }
  }
}
