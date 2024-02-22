import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../app.config";
import {JwtHandler} from "../../identity/jwt.handler";

@Injectable({
  providedIn: 'root'
})
export class AccountOrdersService {
  constructor(private http: HttpClient, private jwtHandler: JwtHandler) {}

  fetchOrders() {
    return this.http.get(apiURL + '/orders', {
      headers: {
        'Authorization': 'Bearer ' + this.jwtHandler.getToken()
      }
    });
  }

  fetchOrderByOrderNumber(orderNumber: number) {
    return this.http.get(apiURL + '/orders/' + orderNumber, {
      headers: {
        'Authorization': 'Bearer ' + this.jwtHandler.getToken()
      }
    });
  }

  cancelTicket(ticket: any) {
    return this.http.put(apiURL + '/tickets/' + ticket.id + '/cancel', null, {
      headers: {
        'Authorization': 'Bearer ' + this.jwtHandler.getToken()
      }
    });
  }

  cancelOrder(order: any) {
    return this.http.put(apiURL + '/orders/' + Number(order.orderNumber) + '/cancel', null, {
      headers: {
        'Authorization': 'Bearer ' + this.jwtHandler.getToken()
      }
    });
  }
}
