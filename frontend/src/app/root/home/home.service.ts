import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../app.config";
import {Injectable} from "@angular/core";
import {JwtHandler} from "../../identity/jwt.handler";

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  constructor(private http: HttpClient, private jwtHandler: JwtHandler) { }

  fetchHomeEvents() {
    const token = this.jwtHandler.getToken();
    if (!token) {
      return this.http.get(apiURL + '/events/home');
    }
    else {
      return this.http.get(apiURL + '/events/home', {
        headers: {
          'Authorization': 'Bearer ' + this.jwtHandler.getToken()
        }
      });
    }
  }
}
