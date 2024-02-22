import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../../app.config";

@Injectable({
    providedIn: 'root'
})
export class ValidateService {
  constructor(private http: HttpClient) {}

  validateTicket(ticketId: string) {
    return this.http.get(apiURL + '/tickets/validate/' + ticketId, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
  }
}
