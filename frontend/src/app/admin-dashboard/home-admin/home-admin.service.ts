import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../app.config";
import {JwtHandler} from "../../identity/jwt.handler";

@Injectable({
    providedIn: 'root'
})
export class HomeAdminService {
  constructor(private http: HttpClient, private jwtHandler: JwtHandler) { }

  fetchTopEvents() {
      return this.http.get(apiURL + '/top-events');
  }

  addTopEventList(topEventList: any) {
    return this.http.post(apiURL + '/top-events', topEventList, {
      headers: {
        'Authorization': 'Bearer ' + this.jwtHandler.getToken()
      }
    });
  }

  deleteTopEvent(id: string) {
    return this.http.delete(apiURL + '/top-events/' + id, {
      headers: {
        'Authorization': 'Bearer ' + this.jwtHandler.getToken()
      }
    });
  }
}
