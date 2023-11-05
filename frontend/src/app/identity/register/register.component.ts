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

      this.inputFieldsErrorService.subject.next('Please fill all fields!');
      return false;
    }

    if(this.password !== this.confirmPassword) {
      this.inputFieldsErrorService.subject.next('Passwords do not match!');
      return false;
    }

    if(!this.emailHandler.isEmailValid(this.email)) {
      this.inputFieldsErrorService.subject.next('Please enter a valid email!');
      return false;
    }

    return true;
  }
}
