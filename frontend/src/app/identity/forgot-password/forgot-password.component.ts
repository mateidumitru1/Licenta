import { Component } from '@angular/core';
import {EmailHandler} from "../handlers/email.handler";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  email: string = '';
  invalidEmail: boolean = false;

  constructor(private emailHandler: EmailHandler) { }

  changePassword() {
    if(!this.emailHandler.isEmailValid(this.email)) {
      this.invalidEmail = true;
      setTimeout(() => {
        this.invalidEmail = false;
      }, 1000);
      return;
    }
  }
}
