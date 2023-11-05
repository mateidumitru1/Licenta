import { Component } from '@angular/core';
import {EmailHandler} from "../../handlers/email.handler";
import {InputFieldsErrorService} from "../../shared/input-fields-error/input-fields-error.service";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  email: string = '';

  constructor(private emailHandler: EmailHandler, private inputFieldsErrorService: InputFieldsErrorService) { }

  changePassword() {
    if(!this.emailHandler.isEmailValid(this.email)) {
      this.inputFieldsErrorService.subject.next();
    }
  }
}
