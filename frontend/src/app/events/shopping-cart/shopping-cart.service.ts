import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {IdentityService} from "../../identity/identity.service";
import {CookieService} from "ngx-cookie-service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  private readonly shoppingCartUrl = 'http://localhost:8080/api/shopping-cart';

  constructor(private http: HttpClient, private identityService: IdentityService, private snackBar: MatSnackBar) {
  }

  getShoppingCart() {
    if (!this.identityService.isLoggedIn()) {
      this.snackBar.open('You must be logged in to view your shopping cart', 'Dismiss', {duration: 3000});
      return;
    }
    return this.http.get(this.shoppingCartUrl, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
  }

  removeTicketFromShoppingCart(ticketType: { id: string, name: string; price: number; quantity: number, event: any;}) {
    if (!this.identityService.isLoggedIn()) {
      this.snackBar.open('You must be logged in to view your shopping cart', 'Dismiss', {duration: 3000});
      return;
    }
    console.log(ticketType);
    return this.http.put(this.shoppingCartUrl + '/' + ticketType.id, null,{
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
  }
}
