import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../../app.config";
import {JwtHandler} from "../../../identity/jwt.handler";

@Injectable({
    providedIn: 'root'
})
export class ValidateService {
  constructor(private http: HttpClient, private jwtHandler: JwtHandler) {}

  validateTicket(ticketId: string) {
    return this.http.get(apiURL + '/tickets/validate/' + ticketId, {
      headers: {
        'Authorization': 'Bearer ' + this.jwtHandler.getToken()
      }
    });
  }
}
