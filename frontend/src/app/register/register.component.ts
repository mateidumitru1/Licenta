import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";

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
  invalidRegister: boolean = false;

  constructor(private http: HttpClient) { }

  onRegister(): void {
    if(this.firstName === '' || this.lastName === '' || this.username === '' || this.password === '' || this.email === '') {
      this.invalidRegister = true;
      setTimeout(() => {
        this.invalidRegister = false;
      }, 1000);
      return;
    }
    this.http.post('http://localhost:8080/api/register', {
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      password: this.password,
      email: this.email
    }).subscribe((response: any) => {
      console.log(response);
    });
  }
}
