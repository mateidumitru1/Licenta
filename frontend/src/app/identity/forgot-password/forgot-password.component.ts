import {Component, HostListener} from '@angular/core';
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

  @HostListener('document:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      this.changePassword();
    }
  }

  changePassword() {
    if(!this.emailHandler.isEmailValid(this.email)) {
      this.inputFieldsErrorService.subject.next('Email is not valid!');
      return;
    }
    this.identityService.forgotPassword(this.email);
  }
}
