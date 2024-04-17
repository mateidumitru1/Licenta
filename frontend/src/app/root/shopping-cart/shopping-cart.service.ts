import {Injectable, OnDestroy, OnInit} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../app.config";
import {IdentityService} from "../../identity/identity.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {JwtHandler} from "../../identity/jwt.handler";
import {BehaviorSubject, lastValueFrom, Subscription} from "rxjs";
import {HeaderService} from "../header/header.service";

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private shoppingCartSubject = new BehaviorSubject<any>({});

  constructor(private http: HttpClient,
              private identityService: IdentityService,
              private headerService: HeaderService,
              private snackBar: MatSnackBar) {}

  setShoppingCart(shoppingCart: any) {
    this.shoppingCartSubject.next(shoppingCart);
  }

  getShoppingCart() {
    return this.shoppingCartSubject.asObservable();
  }

  async fetchShoppingCart() {
    try {
      const shoppingCart = await lastValueFrom(this.http.get(apiURL + '/shopping-cart', {
        headers: {
          'Authorization': 'Bearer ' + this.identityService.getToken()
        }
      }));
      this.setShoppingCart(shoppingCart);
    }
    catch (error) {
      this.snackBar.open('Error fetching shopping cart', 'Dismiss', {duration: 3000});
    }
  }

  async updateQuantity(shoppingCartItem: any) {
    if (!this.identityService.isLoggedIn()) {
      this.snackBar.open('You must be logged in to view your shopping cart', 'Dismiss', {duration: 3000});
      return;
    }
    try {
      const shoppingCart = await lastValueFrom(this.http.patch(apiURL + '/shopping-cart/' + shoppingCartItem.id + '?quantity=' + shoppingCartItem.quantity, null, {
        headers: {
          'Authorization': 'Bearer ' + this.identityService.getToken()
        }
      }));
      this.setShoppingCart(shoppingCart);
    }
    catch (error) {
      this.snackBar.open('Error updating quantity', 'Dismiss', {duration: 3000});
    }
  }

  async removeTicketFromShoppingCart(ticketType: any) {
    if (!this.identityService.isLoggedIn()) {
      this.snackBar.open('You must be logged in to view your shopping cart', 'Dismiss', {duration: 3000});
      return;
    }
    try {
      const shoppingCart = await lastValueFrom(this.http.delete(apiURL + '/shopping-cart/' + ticketType.id, {
        headers: {
          'Authorization': 'Bearer ' + this.identityService.getToken()
        }
      }));
      this.setShoppingCart(shoppingCart);
    }
    catch (error) {
      this.snackBar.open('Error removing ticket from shopping cart', 'Dismiss', {duration: 3000});
    }
  }

  async buyTickets() {
    try {
      await lastValueFrom(this.http.post(apiURL + '/orders', null, {
        headers: {
          'Authorization': 'Bearer ' + this.identityService.getToken()
        }
      }));
      this.setShoppingCart({});
    }
    catch (error) {
      this.snackBar.open('Error buying tickets', 'Dismiss', {duration: 3000});
    }
  }
}
