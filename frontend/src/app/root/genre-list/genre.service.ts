import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../app.config";

@Injectable({
  providedIn: 'root'
})
export class GenreService {
  constructor(private http: HttpClient) {}

  getGenres() {
    return this.http.get(apiURL + '/broad-genres');
  }
}
