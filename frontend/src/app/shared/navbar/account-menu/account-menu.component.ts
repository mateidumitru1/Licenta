import { Component } from '@angular/core';
import {NavbarService} from "../navbar.service";

@Component({
  selector: 'app-account-menu',
  templateUrl: './account-menu.component.html',
  styleUrls: ['./account-menu.component.css']
})
export class AccountMenuComponent {

  constructor(private navbarService: NavbarService) { }

  getNavbarService() {
    return this.navbarService;
  }
}
