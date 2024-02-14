import {Injectable, OnInit} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import * as global from "../../shared/global";

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private http: HttpClient) { }

  fetchOrders() {
    return this.http.get(global.host + '/orders', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
  }

  cancelTicket(ticket: any) {
    return this.http.put(global.host + '/orders/' + ticket.id + '/cancel', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
  }

  cancelOrder(order: any) {
    return this.http.put(global.host + '/orders/' + order.id + '/cancel', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
  }
}

