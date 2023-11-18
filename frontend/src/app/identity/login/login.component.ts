import {Component, OnInit, OnDestroy, HostListener, AfterViewInit} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Router} from "@angular/router";
import {JwtHandler} from "../../util/handlers/jwt.handler";
import {IdentityService} from "../identity.service";
import {InputFieldsErrorService} from "../../shared/input-fields-error/input-fields-error.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent{

  username: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router, private identityService: IdentityService,
              private jwtHandler: JwtHandler, private inputFieldsErrorService: InputFieldsErrorService) { }

  @HostListener('document:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      this.onLogin();
    }
  }

  onLogin(): void {
    if (this.username === '' || this.password === '') {
      this.inputFieldsErrorService.subject.next('Please enter username and password!');
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
        this.inputFieldsErrorService.subject.next('Invalid username or password!');
      });
    }
  }
}
