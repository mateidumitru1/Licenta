import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import * as global from "../../shared/global";


@Injectable({providedIn: 'root'})
export class LocationService {

  constructor(private http: HttpClient) {}

  fetchLocationById(id: string): Observable<any> {
    return this.http.get(global.apiURL + '/locations/' + id);
  }

  fetchLocationWithAvailableEventsById(id: string): Observable<any> {
    return this.http.get(global.apiURL + '/locations/' + id + '/available-events');
  }

  fetchAllLocations(): Observable<any> {
    return this.http.get(global.apiURL + '/locations');
  }

  fetchArchivedEvents(id: string): Observable<any> {
    return this.http.get(global.apiURL + '/locations/' + id + '/unavailable-events');
  }
}
