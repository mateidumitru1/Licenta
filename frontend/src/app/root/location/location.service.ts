import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../app.config";

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor(private http: HttpClient) {}

  fetchInitialEventsByLocationId(id: string, page: number, size: number) {
    return this.http.get(apiURL + '/events/location/' + id + '/initial', {
      params: {
        page: page.toString(),
        size: size.toString()
      }
    });
  }

  fetchMoreEventsByLocationId(id: string, page: number, size: number) {
    return this.http.get(apiURL + '/events/location/' + id, {
      params: {
        page: page.toString(),
        size: size.toString()
      }
    });
  }
}
