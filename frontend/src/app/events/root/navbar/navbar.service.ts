import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  showLocationMenu: boolean = false;

  constructor() { }
  onMouseEnterLocations() {
    this.showLocationMenu = true;
  }

  onMouseLeaveLocations() {
    this.showLocationMenu = false;
  }

  onClick() {
    // @ts-ignore
    this.showLocationMenu = false;
  }
}
