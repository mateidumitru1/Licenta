import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../app.config";
import {JwtHandler} from "../../identity/jwt.handler";

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  constructor(private http: HttpClient, private jwtHandler: JwtHandler) {}

  fetchStatistics(filter: string) {
    return this.http.get(apiURL + '/statistics/' + filter, {
      headers: {
        'Authorization': 'Bearer ' + this.jwtHandler.getToken()
      }
    });
  }
}
