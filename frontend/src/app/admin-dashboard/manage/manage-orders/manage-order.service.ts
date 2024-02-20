import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../../app.config";

@Injectable({
  providedIn: 'root'
})
export class ManageOrderService {
  constructor(private http: HttpClient) {}

  fetchOrders() {
    return this.http.get(apiURL + '/orders', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    });
  }

  fetchOrderByNumber(number: string) {
    return this.http.get(apiURL + `/orders/` + number,
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      });
  }

  fetchOrdersByUserId(userId: string) {
    return this.http.get(apiURL + `/orders/user/` + userId,
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      });
  }

  cancelOrder(order: any) {
    console.log(order);
    return this.http.put(apiURL + `/orders/` + order.orderNumber + '/admin/cancel', null,
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      });
  }

  cancelTicket(ticket: any) {
    return this.http.put(apiURL + `/tickets/` + ticket.id + '/admin/cancel', null,
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      });
  }
}
