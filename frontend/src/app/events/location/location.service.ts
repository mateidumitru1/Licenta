import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import * as global from "../../shared/global";


@Injectable({providedIn: 'root'})
export class LocationService {

  constructor(private http: HttpClient) {}

  fetchLocationById(id: string): Observable<any> {
    return this.http.get(global.host + '/locations/' + id);
  }

  fetchLocationWithAvailableEventsById(id: string): Observable<any> {
    return this.http.get(global.host + '/locations/' + id + '/available-events');
  }

  fetchAllLocations(): Observable<any> {
    return this.http.get(global.host + '/locations');
  }

  fetchArchivedEvents(id: string): Observable<any> {
    return this.http.get(global.host + '/locations/' + id + '/unavailable-events');
  }
}
