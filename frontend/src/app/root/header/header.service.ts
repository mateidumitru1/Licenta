import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../app.config";
import {BehaviorSubject} from "rxjs";
import {ShoppingCartService} from "../shopping-cart/shopping-cart.service";

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  constructor(private http: HttpClient) { }

  fetchLocations() {
    return this.http.get(apiURL + '/locations/all');
  }

  search(searchText: string) {
    return this.http.get(apiURL + '/search?query=' + searchText);
  }
}
