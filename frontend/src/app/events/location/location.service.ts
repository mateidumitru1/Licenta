import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";


@Injectable({providedIn: 'root'})
export class LocationService {

  constructor(private http: HttpClient) {}

  fetchEvents(id: string): Observable<any> {
    return this.http.get('http://localhost:8080/api/locations/' + id);
  }

  fetchAllLocations(): Observable<any> {
    return this.http.get('http://localhost:8080/api/locations');
  }
}
