import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../app.config";

@Injectable({
  providedIn: 'root'
})
export class TrackEventService {
  constructor(private http: HttpClient) {
  }

  fetchTickets() {
    return this.http.get(apiURL + '/tickets', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
  }

  fetchTicketsByEventId(id: string) {
    return this.http.get(apiURL + '/tickets/' + id, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
  }
}
