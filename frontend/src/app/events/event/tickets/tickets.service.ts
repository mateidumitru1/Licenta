import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {IdentityService} from "../../../identity/identity.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({providedIn: 'root'})
export class TicketsService {

  constructor(private http: HttpClient, private identityService: IdentityService,
              private snackBar: MatSnackBar) {}

  addTicketsToCart(selectedTicketslist: any) {
    if (!this.identityService.isLoggedIn()) {
      this.snackBar.open('You must be logged in to buy tickets', 'Dismiss', {duration: 3000});
      return;
    }
    const items: { ticketTypeId: string, quantity: number }[] = [];
    selectedTicketslist.forEach((ticket: any) => {
      if (ticket.quantity > 0) {
        items.push({ticketTypeId: ticket.ticketType.id, quantity: ticket.quantity});
      }
    });

    console.log(items);

    this.http.post(
      'http://localhost:8080/api/shopping-cart',
      items,
      {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).subscribe((response: any) => {
      this.snackBar.open('Tickets added to shopping cart!', 'Dismiss', {duration: 3000});
    }, (error: any) => {
      this.snackBar.open('Error adding tickets to shopping cart!', 'Dismiss', {duration: 3000});
    });
  }
}
