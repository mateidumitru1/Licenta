import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../app.config";
import {Injectable} from "@angular/core";
import {JwtHandler} from "../../identity/jwt.handler";

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  constructor(private http: HttpClient, private jwtHandler: JwtHandler) { }

  fetchSelectedEvents() {
    return this.http.get(apiURL + '/events/selected');
  }

  fetchRecommendedEvents() {
    return this.http.get(apiURL + '/recommendations', {
      headers: {
        'Authorization': 'Bearer ' + this.jwtHandler.getToken()
      }
    });
  }
}
