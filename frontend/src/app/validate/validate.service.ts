import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ValidateService {

  constructor(private http: HttpClient) { }

  validateTicket(ticketId: string) {
    return this.http.get('http://localhost:8080/api/tickets/validate/' + ticketId);
  }
}
