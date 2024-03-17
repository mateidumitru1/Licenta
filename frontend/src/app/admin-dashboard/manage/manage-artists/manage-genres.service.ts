import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../../app.config";

@Injectable({
  providedIn: 'root'
})
export class ManageGenresService {
  constructor(private http: HttpClient) {}

  fetchGenres() {
    return this.http.get(apiURL + '/genres');
  }
}
