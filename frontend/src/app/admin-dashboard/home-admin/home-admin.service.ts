import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../app.config";
import {JwtHandler} from "../../identity/jwt.handler";

@Injectable({
    providedIn: 'root'
})
export class HomeAdminService {
  constructor(private http: HttpClient, private jwtHandler: JwtHandler) { }

  fetchSelectedEvents() {
      return this.http.get(apiURL + '/events/selected');
  }

  addSelectedEventList(selectedEventIdList: any) {
    return this.http.post(apiURL + '/events/select', selectedEventIdList, {
      headers: {
        'Authorization': 'Bearer ' + this.jwtHandler.getToken()
      }
    });
  }

  deleteSelectedEvent(id: string) {
    return this.http.delete(apiURL + '/events/deselect/' + id, {
      headers: {
        'Authorization': 'Bearer ' + this.jwtHandler.getToken()
      }
    });
  }
}
