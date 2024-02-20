import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {IdentityService} from "../identity.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {passwordMatchValidator} from "../register/validators";
import {MdbFormsModule} from "mdb-angular-ui-kit/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MdbFormsModule,
    NgIf,
    RouterLink
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  form: FormGroup;

  constructor(private router: Router, private identityService: IdentityService, private fb: FormBuilder,
              private snackBar: MatSnackBar, private route: ActivatedRoute) {
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: [passwordMatchValidator]
    });
  }

  onClickConfirm() {
    this.form.markAllAsTouched();
    if(this.form.valid) {
      const token = this.route.snapshot.url[this.route.snapshot.url.length - 1].path;
      this.identityService.resetPassword(token, this.form.value.password);
    }
  }
}
