import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../app.config";

@Injectable({
    providedIn: 'root'
})
export class HomeAdminService {
  constructor(private http: HttpClient) { }

  fetchTopEvents() {
      return this.http.get(apiURL + '/top-events');
  }

  addTopEventList(topEventList: any) {
    return this.http.post(apiURL + '/top-events', topEventList, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
  }

  deleteTopEvent(id: string) {
    return this.http.delete(apiURL + '/top-events/' + id, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
  }
}
