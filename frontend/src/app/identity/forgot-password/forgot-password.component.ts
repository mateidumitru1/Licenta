import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {IdentityService} from "../identity.service";
import {JwtHandler} from "../jwt.handler";
import {MdbFormsModule} from "mdb-angular-ui-kit/forms";
import {NgIf} from "@angular/common";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MdbFormsModule,
    NgIf
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  registrationForm: FormGroup;

  constructor(private router: Router, private identityService: IdentityService, private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.registrationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onResetPasswordClick() {
    this.registrationForm.markAllAsTouched();
    if (this.registrationForm.valid) {
      this.identityService.forgotPassword(this.registrationForm.value.email);
    }
  }
}
