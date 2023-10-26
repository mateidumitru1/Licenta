import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) {}

  fetchEvent(eventId: string): Observable<any> {
    return this.http.get('http://localhost:8080/api/events?id=' + eventId);
  }

  fetchAllEvents(): Observable<any> {
    return this.http.get('http://localhost:8080/api/events/all');
  }
}
