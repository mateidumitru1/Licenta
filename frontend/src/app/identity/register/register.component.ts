import {Component} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MdbFormsModule} from "mdb-angular-ui-kit/forms";
import {Router, RouterLink} from "@angular/router";
import {IdentityService} from "../identity.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgClass, NgIf, NgStyle} from "@angular/common";
import {passwordMatchValidator} from "./validators";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    MdbFormsModule,
    RouterLink,
    ReactiveFormsModule,
    NgIf,
    NgClass,
    NgStyle
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registrationForm: FormGroup;

  constructor(private fb: FormBuilder, private identityService: IdentityService, private router: Router,
              private snackBar: MatSnackBar) {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    }, {
      validators: [passwordMatchValidator]
    });
  }

  onRegister() {
    this.registrationForm.markAllAsTouched();

    if (this.registrationForm.valid) {
      const firstName = this.registrationForm.get('firstName')?.value;
      const lastName = this.registrationForm.get('lastName')?.value;
      const username = this.registrationForm.get('username')?.value;
      const email = this.registrationForm.get('email')?.value;
      const password = this.registrationForm.get('password')?.value;
      const confirmPassword = this.registrationForm.get('confirmPassword')?.value;

      this.identityService.register(firstName, lastName, username, password, email).subscribe({
        next: (response: any) => {
          this.snackBar.open('A fost trimis un email pentru verificarea contului!', 'Close', {duration: 3000});
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.snackBar.open(error.error, 'Close', {duration: 3000});
        }
      })
    }
  }
}
