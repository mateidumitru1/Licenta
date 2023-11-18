import {Component, OnInit} from '@angular/core';
import {NavbarService} from "../navbar.service";
import {JwtHandler} from "../../../../util/handlers/jwt.handler";
import {HttpClient} from "@angular/common/http";
import {IdentityService} from "../../../../identity/identity.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-account-menu',
  templateUrl: './account-menu.component.html',
  styleUrls: ['./account-menu.component.css']
})
export class AccountMenuComponent implements OnInit{

  accountMenuText = '';

  constructor(private navbarService: NavbarService, private identityService: IdentityService, private http: HttpClient,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    if(this.identityService.isLoggedIn()) {
      this.accountMenuText = 'Hello, ' + this.identityService.getUserName();
    }
    else {
      this.accountMenuText = 'Account';
    }
  }

  logout() {
    this.identityService.logout();
    this.accountMenuText = 'Account';
  }

  getNavbarService() {
    return this.navbarService;
  }

  getIdentityService() {
    return this.identityService;
  }
}
