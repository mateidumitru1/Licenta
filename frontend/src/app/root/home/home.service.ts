import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../app.config";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  constructor(private http: HttpClient) { }

  fetchTopEvents() {
    return this.http.get(apiURL + '/top-events');
  }
}
