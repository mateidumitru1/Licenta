import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../app.config";
import {IdentityService} from "../../identity/identity.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService{
  constructor(private http: HttpClient, private identityService: IdentityService, private snackBar: MatSnackBar) {}

  fetchShoppingCart() {
    return this.http.get(apiURL + '/shopping-cart', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
  }

  updateQuantity(shoppingCartItem: any) {
    if (!this.identityService.isLoggedIn()) {
      this.snackBar.open('You must be logged in to view your shopping cart', 'Dismiss', {duration: 3000});
      return;
    }
    console.log(shoppingCartItem);
    return this.http.patch(apiURL + '/shopping-cart/' + shoppingCartItem.id + '?quantity=' + shoppingCartItem.quantity, null, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
  }

  removeTicketFromShoppingCart(ticketType: any) {
    if (!this.identityService.isLoggedIn()) {
      this.snackBar.open('You must be logged in to view your shopping cart', 'Dismiss', {duration: 3000});
      return;
    }
    return this.http.put(apiURL + '/shopping-cart/' + ticketType.id, null,{
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
  }

  buyTickets() {
    return this.http.post(apiURL + '/orders', null, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
  }
}
