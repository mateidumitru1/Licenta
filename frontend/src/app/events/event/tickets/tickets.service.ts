import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {IdentityService} from "../../../identity/identity.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({providedIn: 'root'})
export class TicketsService {

  constructor(private http: HttpClient, private identityService: IdentityService,
              private snackBar: MatSnackBar) {}

  buyTicket(ticketType: any) {
    if (!this.identityService.isLoggedIn()) {
      this.snackBar.open('You must be logged in to buy tickets', 'Dismiss', {duration: 3000});
      return;
    }
    console.log(ticketType);
    return this.http.post(
      'http://localhost:8080/api/shopping-cart/' + ticketType.id,
      null,
      {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }
    );
  }
}
