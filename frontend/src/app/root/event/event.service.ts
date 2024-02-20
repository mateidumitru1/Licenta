import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {apiURL} from "../../app.config";

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private http: HttpClient) {}

  fetchEventById(id: string) {
    return this.http.get(apiURL + '/events', {params: {id: id}});
  }

  addTicketsToCart(selectedTicketsList: any) {
    // return this.http.post(apiURL + '/shopping-cart', items);
  }
}
