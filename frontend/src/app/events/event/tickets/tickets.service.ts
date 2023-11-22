import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class TicketsService {

  constructor(private http: HttpClient) {}

  buyTicket(ticketType: any) {
    return this.http.post(
      'http://localhost:8080/api/ticket',
      { ticketTypeId: ticketType.id },
      {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }
    );
  }
}
