import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  showAccountMenu: boolean = false;
  showPlacesMenu: boolean = false;

  placeRef: HTMLAnchorElement | undefined;

  constructor() { }

  onMouseEnterAccount() {
    this.showAccountMenu = true;
  }

  onMouseLeaveAccount() {
    this.showAccountMenu = false;
  }

  onMouseEnterPlaces(place: HTMLAnchorElement) {
    this.placeRef = place;
    this.showPlacesMenu = true;
  }

  onMouseLeavePlaces() {
    this.showPlacesMenu = false;
  }

  onClick() {
    // @ts-ignore
    this.placeRef.style.boxShadow = 'none';
    this.showAccountMenu = false;
    this.showPlacesMenu = false;
  }

}
