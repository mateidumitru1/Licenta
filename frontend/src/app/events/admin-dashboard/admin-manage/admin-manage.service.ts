import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {EventService} from "../../event/event.service";
import {LocationService} from "../../location/location.service";

@Injectable({providedIn: 'root'})
export class AdminManageService {

  constructor(private http: HttpClient, private eventService: EventService, private locationService: LocationService) {
  }

  fetchUsers(): Observable<any> {
    return this.http.get('http://localhost:8080/api/users', {
        headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}
      }
    );
  }

  fetchEvents(): Observable<any> {
    return this.eventService.fetchAllEvents();
  }

  fetchLocations(): Observable<any> {
    return this.locationService.fetchAllLocations();
  }
}
