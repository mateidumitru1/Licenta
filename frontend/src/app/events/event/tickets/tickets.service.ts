import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {IdentityService} from "../../../identity/identity.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import * as global from "../../../shared/global";

@Injectable({providedIn: 'root'})
export class TicketsService {

  constructor(private http: HttpClient, private identityService: IdentityService,
              private snackBar: MatSnackBar) {}

  addTicketsToCart(selectedTicketsList: any) {
    if (!this.identityService.isLoggedIn()) {
      this.snackBar.open('You must be logged in to buy tickets', 'Dismiss', {duration: 3000});
      return;
    }
    const items: { ticketTypeId: string, quantity: number }[] = [];
    selectedTicketsList.forEach((ticket: any) => {
      if (ticket.quantity > 0) {
        items.push({ticketTypeId: ticket.ticketType.id, quantity: ticket.quantity});
      }
    });
    if (items.length === 0) {
      this.snackBar.open('You must select at least one ticket', 'Dismiss', {duration: 3000});
      return;
    }
    this.http.post(
      global.host + '/shopping-cart',
      items,
      {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).subscribe((response: any) => {
      this.snackBar.open('Tickets added to shopping cart!', 'Dismiss', {duration: 3000});
    }, (error: any) => {
        this.snackBar.open(error.error, 'Dismiss', {duration: 3000});
    });
  }
}
