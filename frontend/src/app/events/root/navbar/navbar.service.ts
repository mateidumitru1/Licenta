import {Injectable} from "@angular/core";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  showLocationMenu: boolean = false;

  constructor(private router: Router) { }
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

  onShoppingCartClick() {
    this.router.navigate(['/shopping-cart']);
  }
}
