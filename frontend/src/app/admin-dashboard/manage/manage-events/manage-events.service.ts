import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../../app.config";
import {getFormData} from "../shared/form-data.handler";

@Injectable({
  providedIn: 'root'
})
export class ManageEventsService {

  constructor(private http: HttpClient) {}

  fetchEvents() {
    return this.http.get(apiURL + '/events/all');
  }

  addEvent(event: any) {
    return this.http.post(apiURL + '/events', getFormData(event), {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    });
  }

  updateEvent(event: any) {
    return this.http.patch(apiURL + '/events', getFormData(event), {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    });
  }

  deleteEvent(id: string) {
    return this.http.delete(apiURL + `/events/${id}`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    });
  }
}

