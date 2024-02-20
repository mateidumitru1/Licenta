import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../app.config";

@Injectable({
  providedIn: 'root'
})
export class AccountOrdersService {
  constructor(private http: HttpClient) {}

  fetchOrders() {
    return this.http.get(apiURL + '/orders', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
  }

  fetchOrderByOrderNumber(orderNumber: number) {
    return this.http.get(apiURL + '/orders/' + orderNumber, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
  }

  cancelTicket(ticket: any) {
    return this.http.put(apiURL + '/tickets/' + ticket.id + '/cancel', null, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
  }

  cancelOrder(order: any) {
    return this.http.put(apiURL + '/orders/' + Number(order.orderNumber) + '/cancel', null, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
  }
}
