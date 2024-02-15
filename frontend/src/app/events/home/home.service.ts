import {Injectable, OnInit} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import * as global from "../../shared/global";

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  constructor(private http: HttpClient) {
  }

  fetchTopEvents() {
    return this.http.get(global.host + '/top-events');
  }
}
