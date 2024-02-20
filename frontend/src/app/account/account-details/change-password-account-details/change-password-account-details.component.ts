import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {passwordMatchValidator} from "../../../identity/register/validators";
import {MdbFormsModule} from "mdb-angular-ui-kit/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-change-password-account-details',
  standalone: true,
  imports: [
    FormsModule,
    MdbFormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './change-password-account-details.component.html',
  styleUrl: './change-password-account-details.component.scss'
})
export class ChangePasswordAccountDetailsComponent {
  form: FormGroup;
  constructor(private dialogRef: MatDialogRef<ChangePasswordAccountDetailsComponent>, @Inject(MAT_DIALOG_DATA) data: any,
              private fb: FormBuilder) {
    this.form = this.fb.group({
      oldPassword: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {
      validators: passwordMatchValidator
    });
  }

  onCloseClick() {
    this.dialogRef.close();
  }

  onConfirmClick() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      let result = {
        oldPassword: this.form.value.oldPassword,
        newPassword: this.form.value.password,
        confirmPassword: this.form.value.confirmPassword
      }
      this.dialogRef.close(result);
    }
  }
}
