import { Component } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  username: string = '';
  password: string = '';
  invalidLogin: boolean = false;

  constructor(private http: HttpClient, private router: Router) { }


  onLogin(): void {
    if(this.username == '' || this.password == ''){
      this.invalidLogin = true;
      setTimeout(() => {
        this.invalidLogin = false;
      }, 1000);
      return;
    }
    this.http.post('http://localhost:8080/api/authenticate', {
      username: this.username,
      password: this.password
    }).subscribe((response: any) => {
      localStorage.setItem('token', response.token);
      localStorage.setItem('username', response.username);
      localStorage.setItem('role', response.role);
      this.router.navigate(['home']);
    });
  }
}
