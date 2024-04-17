import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../../app.config";
import {BehaviorSubject, lastValueFrom} from "rxjs";
import {IdentityService} from "../../../identity/identity.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class ManageOrderService {
  private orderSubject = new BehaviorSubject<any>({});

  constructor(private http: HttpClient, private identityService: IdentityService, private snackBar: MatSnackBar) {}

  setOrderSubject(data: any) {
    this.orderSubject.next(data);
  }

  getOrderSubject() {
    return this.orderSubject.asObservable();
  }

  async fetchOrders() {
    try {
      const response = await lastValueFrom(this.http.get(apiURL + '/orders', {
        headers: {
          Authorization: 'Bearer ' + this.identityService.getToken()
        }
      }));
      this.setOrderSubject(response);
    }
    catch (error) {
      this.snackBar.open('Error fetching orders', 'Close', {
        duration: 3000
      });
    }
  }

  async fetchOrderByNumber(number: string) {
    try {
      return await lastValueFrom(this.http.get(apiURL + `/orders/` + number,
        {
          headers: {
            Authorization: 'Bearer ' + this.identityService.getToken()
          }
        }));
    }
    catch (error) {
      this.snackBar.open('Error fetching order', 'Close', {
        duration: 3000
      });
      return;
    }
  }

  async fetchOrdersByUserId(userId: string) {
    try {
      return await lastValueFrom(this.http.get(apiURL + `/orders/user/` + userId,
        {
          headers: {
            Authorization: 'Bearer ' + this.identityService.getToken()
          }
        }));
    }
    catch (error) {
      this.snackBar.open('Error fetching orders', 'Close', {
        duration: 3000
      });
      return;
    }
  }

  async cancelOrder(order: any) {
    try {
      await lastValueFrom(this.http.put(apiURL + `/orders/` + order.orderNumber + '/admin/cancel', null,
        {
          headers: {
            Authorization: 'Bearer ' + this.identityService.getToken()
          }
        }));
      order.status = 'CANCELED';
      order.ticketList.forEach((ticket: any) => {
        ticket.status = 'CANCELED';
      });
      return order;
    }
    catch (error) {
      this.snackBar.open('Error canceling order', 'Close', {
        duration: 3000
      });
    }
  }

  async cancelTicket(ticket: any) {
    try {
      await lastValueFrom(this.http.put(apiURL + `/tickets/` + ticket.id + '/admin/cancel', null,
        {
          headers: {
            Authorization: 'Bearer ' + this.identityService.getToken()
          }
        }));
      ticket.status = 'CANCELED';
      return ticket;
    }
    catch (error) {
      this.snackBar.open('Error canceling ticket', 'Close', {
        duration: 3000
      });
    }
  }
}
