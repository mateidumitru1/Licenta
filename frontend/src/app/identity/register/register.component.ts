import { Component } from '@angular/core';
import {EmailHandler} from "../../handlers/email.handler";
import {IdentityService} from "../identity.service";

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
  invalidRegister: boolean = false;

  constructor(private identityService: IdentityService, private emailHandler: EmailHandler) { }

  onRegister(): void {

    if(!this.checkRegistration()) {
      return;
    }

    this.identityService.register(this.firstName, this.lastName, this.username, this.password, this.email);
  }

  checkRegistration(): boolean {
    if(this.firstName === '' || this.lastName === '' || this.username === '' ||
      this.password === '' || this.confirmPassword === '' || this.email === '') {

      this.timeout('Please fill out all fields');
      return false;
    }

    if(this.password !== this.confirmPassword) {
      this.timeout('Passwords do not match!');
      return false;
    }

    if(!this.emailHandler.isEmailValid(this.email)) {
      this.timeout('Please enter a valid email address!');
      return false;
    }

    return true;
  }

  timeout(message: string): void {
    this.invalidRegister = true;
    this.errorMessage = message;
    setTimeout(() => {
      this.invalidRegister = false;
    }, 1000);
  }
}
