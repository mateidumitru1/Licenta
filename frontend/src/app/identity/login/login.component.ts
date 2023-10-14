import {Component, OnInit, OnDestroy, HostListener} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Router} from "@angular/router";
import {LoginService} from "../../service/login.service";
import {Observable, observable} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy{

  username: string = '';
  password: string = '';
  message: string = '';
  invalidLogin: boolean = false;

  constructor(private http: HttpClient, private router: Router, private loginService: LoginService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {

  }

  @HostListener('document:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      this.onLogin();
    }
  }

  onLogin(): void {
    if (this.username === '' || this.password === '') {
      this.invalidLogin = true;
      this.message = 'Please enter username and password';
      this.timeout();
    } else {
      this.http.post('http://localhost:8080/api/authenticate', {
        username: this.username,
        password: this.password
      }).subscribe((response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.username);
        localStorage.setItem('role', response.role);
        this.router.navigate(['home']);
      }, (error) => {
        this.invalidLogin = true;
        this.message = 'Invalid username or password';
        this.timeout();
      });
    }
  }
  timeout() {
    setTimeout(() => {
      this.invalidLogin = false;
      this.message = '';
    }, 1000);
  }
}
