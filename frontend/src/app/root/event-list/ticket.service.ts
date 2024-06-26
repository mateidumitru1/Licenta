import {Injectable} from "@angular/core";
import {IdentityService} from "../../identity/identity.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../app.config";
import {JwtHandler} from "../../identity/jwt.handler";
import {ShoppingCartService} from "../../account/shopping-cart/shopping-cart.service";
import {HeaderService} from "../header/header.service";

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  constructor(private http: HttpClient,
              private identityService: IdentityService,
              private snackBar: MatSnackBar,
              private shoppingCartService: ShoppingCartService,
              private headerService: HeaderService) {}

  buyTickets(selectedTicketTypes: any[]) {
    if (!this.identityService.isLoggedIn()) {
      this.snackBar.open('You must be logged in to buy tickets', 'Dismiss', {duration: 3000});
      return;
    }
    if (selectedTicketTypes.length === 0) {
      this.snackBar.open('You must select at least one ticket', 'Dismiss', {duration: 3000});
      return;
    }
    this.http.post(
      apiURL + '/shopping-cart',
      selectedTicketTypes,
      {
        headers: {
          'Authorization': 'Bearer ' + this.identityService.getToken()
        }
      }).subscribe({
      next: (shoppingCart: any) => {
        this.shoppingCartService.setShoppingCart(shoppingCart);
        this.headerService.setShoppingCartSize(shoppingCart.shoppingCartItemList?.length);
        this.snackBar.open('Tickets added to shopping cart!', 'Dismiss', {duration: 3000});
      }, error: (error: any) => {
      this.snackBar.open(error.error, 'Dismiss', {duration: 3000});
    }});
  }
}
