import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../../app.config";
import {getFormData} from "../shared/form-data.handler";
import {JwtHandler} from "../../../identity/jwt.handler";

@Injectable({
  providedIn: 'root'
})
export class ManageEventsService {

  constructor(private http: HttpClient, private jwtHandler: JwtHandler) {}

  fetchEvents() {
    return this.http.get(apiURL + '/events/all');
  }

  addEvent(event: any) {
    return this.http.post(apiURL + '/events', getFormData(event), {
      headers: {
        Authorization: 'Bearer ' + this.jwtHandler.getToken()
      }
    });
  }

  updateEvent(event: any) {
    return this.http.patch(apiURL + '/events', getFormData(event), {
      headers: {
        Authorization: 'Bearer ' + this.jwtHandler.getToken()
      }
    });
  }

  deleteEvent(id: string) {
    return this.http.delete(apiURL + `/events/${id}`, {
      headers: {
        Authorization: 'Bearer ' + this.jwtHandler.getToken()
      }
    });
  }
}

