import {Component, ElementRef, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {NavbarService} from "./navbar.service";
import {JwtHandler} from "../../../util/handlers/jwt.handler";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{

  constructor(private route: ActivatedRoute, private navbarService: NavbarService, private jwtHandler: JwtHandler) {
  }

  ngOnInit(): void {
  }

  onShoppingCartClick() {
    this.navbarService.onShoppingCartClick();
  }

  onMouseEnterLocations() {
    this.navbarService.onMouseEnterLocations();
  }

  onMouseLeaveLocations() {
    this.navbarService.onMouseLeaveLocations();
  }

  getNavbarService() {
    return this.navbarService;
  }
}
