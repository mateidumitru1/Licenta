import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import * as global from "../../shared/global";

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) {}

  fetchEvent(eventId: string): Observable<any> {
    return this.http.get(global.host + '/events?id=' + eventId);
  }

  fetchAllEvents(): Observable<any> {
    return this.http.get(global.host + '/events/all');
  }
}
