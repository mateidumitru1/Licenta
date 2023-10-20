import {Component, OnInit} from '@angular/core';
import {NavbarService} from "../navbar.service";
import {JwtHandler} from "../../../handlers/jwt.handler";
import {HttpClient} from "@angular/common/http";
import {IdentityService} from "../../../identity/identity.service";

@Component({
  selector: 'app-account-menu',
  templateUrl: './account-menu.component.html',
  styleUrls: ['./account-menu.component.css']
})
export class AccountMenuComponent implements OnInit{

  accountMenuText = '';

  constructor(private navbarService: NavbarService, private identityService: IdentityService, private http: HttpClient) { }

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
