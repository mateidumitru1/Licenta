import {Component, OnInit, OnDestroy, HostListener} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Router} from "@angular/router";
import {JwtHandler} from "../../handlers/jwt.handler";
import {IdentityService} from "../identity.service";

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

  constructor(private http: HttpClient, private router: Router, private identityService: IdentityService, private jwtHandler: JwtHandler) { }

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
      this.identityService.login(this.username, this.password).subscribe((response: any) => {
        localStorage.setItem('token', response.token);
        if(this.jwtHandler.getRole() === 'ADMIN') {
          this.router.navigate(['admin-dashboard']);
        }
        else {
          this.router.navigate(['home']);
        }
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
