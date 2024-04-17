import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../../app.config";
import {JwtHandler} from "../../../identity/jwt.handler";
import {BehaviorSubject, lastValueFrom} from "rxjs";
import {IdentityService} from "../../../identity/identity.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
    providedIn: 'root'
})
export class ValidateService {
  private ticketSubject = new BehaviorSubject<any>({});

  constructor(private http: HttpClient, private identityService: IdentityService, private snackBar: MatSnackBar) {}

  setTicket(ticket: any) {
    this.ticketSubject.next(ticket);
  }

  getTicket() {
    return this.ticketSubject.asObservable();
  }

  async validateTicket(ticketId: string) {
    try {
      const ticket: any = await lastValueFrom(this.http.get(apiURL + '/tickets/validate/' + ticketId, {
        headers: {
          'Authorization': 'Bearer ' + this.identityService.getToken()
        }
      }));
      this.setTicket(ticket);
    }
    catch (error) {
      this.snackBar.open('Ticket not found', 'Close', {
        duration: 3000
      });
    }
  }
}
