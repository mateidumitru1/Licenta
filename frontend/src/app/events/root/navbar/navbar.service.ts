import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  showPlacesMenu: boolean = false;

  constructor() { }
  onMouseEnterLocations() {
    this.showPlacesMenu = true;
  }

  onMouseLeaveLocations() {
    this.showPlacesMenu = false;
  }

  onClick() {
    // @ts-ignore
    this.showPlacesMenu = false;
  }
}
