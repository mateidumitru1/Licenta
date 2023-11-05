import { Component } from '@angular/core';
import {EmailHandler} from "../../util/handlers/email.handler";
import {IdentityService} from "../identity.service";
import {InputFieldsErrorService} from "../../shared/input-fields-error/input-fields-error.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent{

  firstName: string = '';
  lastName: string = '';
  username: string = '';
  password: string = '';
  email: string = '';
  confirmPassword: string = '';

  errorMessage: string = '';

  constructor(private identityService: IdentityService, private emailHandler: EmailHandler,
              private inputFieldsErrorService: InputFieldsErrorService) { }

  onRegister(): void {

    if(!this.checkRegistration()) {
      return;
    }

    this.identityService.register(this.firstName, this.lastName, this.username, this.password, this.email);
  }

  checkRegistration(): boolean {
    if(this.firstName === '' || this.lastName === '' || this.username === '' ||
      this.password === '' || this.confirmPassword === '' || this.email === '') {

      this.errorMessage = 'Please fill all the fields!';
      this.inputFieldsErrorService.subject.next();
      return false;
    }

    if(this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      this.inputFieldsErrorService.subject.next();
      return false;
    }

    if(!this.emailHandler.isEmailValid(this.email)) {
      this.errorMessage = 'Please enter a valid email!';
      this.inputFieldsErrorService.subject.next();
      return false;
    }

    return true;
  }
}
