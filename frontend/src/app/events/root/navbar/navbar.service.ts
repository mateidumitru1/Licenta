import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  showPlacesMenu: boolean = false;

  placeRef: HTMLAnchorElement | undefined;

  constructor() { }
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
    this.showPlacesMenu = false;
  }
}
