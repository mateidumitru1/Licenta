import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../../app.config";

@Injectable({
  providedIn: 'root'
})
export class EventListFilterService {
  constructor(private http: HttpClient) {}

  getLocations() {
    return this.http.get(apiURL + '/locations/names');
  }

  getArtists() {
    return this.http.get(apiURL + '/artists/names');
  }

  getGenres() {
    return this.http.get(apiURL + '/broad-genres/names');
  }
}
