import {Injectable, OnDestroy} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../app.config";
import {JwtHandler} from "../../identity/jwt.handler";
import {BehaviorSubject, lastValueFrom, Subscription} from "rxjs";
import {IdentityService} from "../../identity/identity.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class TrackEventService {
  private bookedEventsSubject = new BehaviorSubject<any>([]);
  private ticketsSubject = new BehaviorSubject<any>([]);

  constructor(private http: HttpClient, private identityService: IdentityService, private snackBar: MatSnackBar) {}

  setBookedEvents(events: any) {
    this.bookedEventsSubject.next(events);
  }

  getBookedEvents() {
    return this.bookedEventsSubject.asObservable();
  }

  setTickets(tickets: any) {
    this.ticketsSubject.next(tickets);
  }

  getTickets() {
    return this.ticketsSubject.asObservable();
  }

  async fetchBookedEvents() {
    try {
      const bookedEvents: any = await lastValueFrom(this.http.get(apiURL + '/events/me', {
        headers: {
          'Authorization': 'Bearer ' + this.identityService.getToken()
        }
      }));
      this.setBookedEvents(bookedEvents);
    }
    catch (error) {
      this.snackBar.open('Error fetching booked events', 'Close', {duration: 3000});
    }
  }

  async fetchTicketsByEventId(id: string) {
    try {
      const tickets: any = await lastValueFrom(this.http.get(apiURL + '/tickets/' + id, {
        headers: {
          'Authorization': 'Bearer ' + this.identityService.getToken()
        }
      }));
      this.setTickets(tickets);
    }
    catch (error) {
      this.snackBar.open('Error fetching tickets', 'Close', {duration: 3000});
    }
  }
}
