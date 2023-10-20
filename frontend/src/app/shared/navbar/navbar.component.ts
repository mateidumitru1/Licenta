import {Component, ElementRef, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {NavbarService} from "./navbar.service";
import {JwtHandler} from "../../handlers/jwt.handler";

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

  isLoginOrRegisterPage() {
    const currentRouter = this.route.snapshot.firstChild?.routeConfig?.path;
    return currentRouter === 'login' || currentRouter === 'register' || currentRouter === 'forgot-password';
  }

  onMouseEnterPlaces(places: HTMLAnchorElement) {
    this.navbarService.onMouseEnterPlaces(places);
    places.style.boxShadow = '0 0 10px 0 rgba(0, 0, 0, 0.5)';
  }

  onMouseLeavePlaces(places: HTMLAnchorElement) {
    this.navbarService.onMouseLeavePlaces();
    places.style.boxShadow = 'none';
  }

  getNavbarService(places: HTMLAnchorElement) {
    return this.navbarService;
  }

  getJwtHandler() {
    return this.jwtHandler;
  }
}
