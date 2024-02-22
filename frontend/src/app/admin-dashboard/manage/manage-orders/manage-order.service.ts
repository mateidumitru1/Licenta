import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../../app.config";
import {JwtHandler} from "../../../identity/jwt.handler";

@Injectable({
  providedIn: 'root'
})
export class ManageOrderService {
  constructor(private http: HttpClient, private jwtHandler: JwtHandler) {}

  fetchOrders() {
    return this.http.get(apiURL + '/orders', {
      headers: {
        Authorization: 'Bearer ' + this.jwtHandler.getToken()
      }
    });
  }

  fetchOrderByNumber(number: string) {
    return this.http.get(apiURL + `/orders/` + number,
      {
        headers: {
          Authorization: 'Bearer ' + this.jwtHandler.getToken()
        }
      });
  }

  fetchOrdersByUserId(userId: string) {
    return this.http.get(apiURL + `/orders/user/` + userId,
      {
        headers: {
          Authorization: 'Bearer ' + this.jwtHandler.getToken()
        }
      });
  }

  cancelOrder(order: any) {
    console.log(order);
    return this.http.put(apiURL + `/orders/` + order.orderNumber + '/admin/cancel', null,
      {
        headers: {
          Authorization: 'Bearer ' + this.jwtHandler.getToken()
        }
      });
  }

  cancelTicket(ticket: any) {
    return this.http.put(apiURL + `/tickets/` + ticket.id + '/admin/cancel', null,
      {
        headers: {
          Authorization: 'Bearer ' + this.jwtHandler.getToken()
        }
      });
  }
}
