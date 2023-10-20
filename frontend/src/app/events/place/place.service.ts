import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class PlaceEventsService {

  constructor(private http: HttpClient) {}

  fetchEvents(placeName: string): Observable<any> {
    return this.http.get('http://localhost:8080/api/places/' + placeName,
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      });
  }
}
