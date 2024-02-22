import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../app.config";
import {JwtHandler} from "../../identity/jwt.handler";

@Injectable({
  providedIn: 'root'
})
export class TrackEventService {
  constructor(private http: HttpClient, private jwtHandler: JwtHandler) {
  }

  fetchTickets() {
    return this.http.get(apiURL + '/tickets', {
      headers: {
        'Authorization': 'Bearer ' + this.jwtHandler.getToken()
      }
    });
  }

  fetchTicketsByEventId(id: string) {
    return this.http.get(apiURL + '/tickets/' + id, {
      headers: {
        'Authorization': 'Bearer ' + this.jwtHandler.getToken()
      }
    });
  }
}
