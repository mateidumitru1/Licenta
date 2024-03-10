import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../app.config";

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  constructor(private http: HttpClient) { }

  fetchLocations() {
    return this.http.get(apiURL + '/locations');
  }

  fetchLocationsWithAvailableEvents() {
    return this.http.get(apiURL + '/locations/available-events');
  }
}
