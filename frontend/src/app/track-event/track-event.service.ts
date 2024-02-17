import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import * as global from "../shared/global";

@Injectable({
  providedIn: 'root'
})
export class TrackEventService {
  constructor(private http: HttpClient) {
  }

  fetchTickets() {
    return this.http.get(global.apiURL + '/tickets', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
  }

  fetchTicketsByEventId(id: string) {
    return this.http.get(global.apiURL + '/tickets/' + id, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
  }
}
