import {HttpClient} from "@angular/common/http";
import * as global from "../../../shared/global";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AdminHomeService {
  constructor(private http: HttpClient) {
  }

  getTopEvents() {
    return this.http.get(global.apiURL + '/top-events');
  }

  addTopEventList(topEventList: any) {
    return this.http.post(global.apiURL + '/top-events', topEventList, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
  }

  deleteTopEvent(id: string) {
    return this.http.delete(global.apiURL + '/top-events/' + id, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
  }
}
