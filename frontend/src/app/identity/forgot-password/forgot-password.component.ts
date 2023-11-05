import { Component } from '@angular/core';
import {EmailHandler} from "../../util/handlers/email.handler";
import {InputFieldsErrorService} from "../../shared/input-fields-error/input-fields-error.service";
import {IdentityService} from "../identity.service";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  email: string = '';

  constructor(private emailHandler: EmailHandler, private inputFieldsErrorService: InputFieldsErrorService,
              private identityService: IdentityService) { }

  changePassword() {
    if(!this.emailHandler.isEmailValid(this.email)) {
      this.inputFieldsErrorService.subject.next('Email is not valid!');
      return;
    }
    this.identityService.forgotPassword(this.email).subscribe(() => {
      alert('Email sent!');
    }, (error: any) => {
      alert(error.error);
    });
  }
}
