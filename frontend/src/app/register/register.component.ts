import { Component } from '@angular/core';
import {RegisterService} from "../service/register.service";

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

  constructor(private registerService: RegisterService) { }

  onRegister(): void {

    if(!this.checkRegistration()) {
      return;
    }

    this.registerService.register(this.firstName, this.lastName, this.username, this.password, this.email);
  }

  checkRegistration(): boolean {
    if(this.firstName === '' || this.lastName === '' || this.username === '' || this.password === '' || this.email === '') {
      this.timeout('Please fill out all fields');
      return false;
    }
    if(this.password !== this.confirmPassword) {
      this.timeout('Passwords do not match!');
      return false;
    }
    if(!this.isEmailValid(this.email)) {
      this.timeout('Please enter a valid email address!');
      return false;
    }
    return true;
  }

  isEmailValid(email: string): boolean {
    const pattern = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$');
    return pattern.test(email);
  }

  timeout(message: string): void {
    this.invalidRegister = true;
    this.errorMessage = message;
    setTimeout(() => {
      this.invalidRegister = false;
    }, 1000);
  }
}
