import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../app.config";

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor(private http: HttpClient) {}

  fetchLocationWithAvailableEventsById(id: string) {
    return this.http.get(apiURL + '/locations/' + id + '/available-events');
  }
}
