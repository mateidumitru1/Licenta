import {Component, ElementRef, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {NavbarService} from "./navbar.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{

  constructor(private route: ActivatedRoute, private navbarService: NavbarService) {
  }

  ngOnInit(): void {
  }

  isLoginOrRegisterPage() {
    const currentRouter = this.route.snapshot.firstChild?.routeConfig?.path;
    return currentRouter === 'login' || currentRouter === 'register' || currentRouter === 'forgot-password';
  }

  onMouseEnterAccount(account: HTMLAnchorElement) {
    this.navbarService.onMouseEnterAccount();
    account.style.boxShadow = '0 0 10px 0 rgba(0, 0, 0, 0.5)';
  }

  onMouseLeaveAccount(account: HTMLAnchorElement) {
    this.navbarService.onMouseLeaveAccount();
    account.style.boxShadow = 'none';
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
}
