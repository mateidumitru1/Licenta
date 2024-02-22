import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {IdentityService} from "../identity.service";
import {MdbValidationModule} from "mdb-angular-ui-kit/validation";
import {NgIf} from "@angular/common";
import {MdbFormsModule} from "mdb-angular-ui-kit/forms";
import {JwtHandler} from "../jwt.handler";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    MdbValidationModule,
    ReactiveFormsModule,
    NgIf,
    MdbFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  registrationForm: FormGroup;

  constructor(private router: Router, private identityService: IdentityService, private fb: FormBuilder) {
    this.registrationForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  ngOnInit() {}

  onLogin() {
    this.registrationForm.markAllAsTouched();
    if (this.registrationForm.valid) {
      const username = this.registrationForm.get('username')?.value;
      const password = this.registrationForm.get('password')?.value;
      const rememberMe = this.registrationForm.get('rememberMe')?.value;

      this.identityService.login(username, password, rememberMe);
    }
  }
}
