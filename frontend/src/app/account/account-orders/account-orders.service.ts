import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../app.config";
import {BehaviorSubject, lastValueFrom} from "rxjs";
import {IdentityService} from "../../identity/identity.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class AccountOrdersService {
  private orderListSubject = new BehaviorSubject<any[]>([]);
  private orderSubject = new BehaviorSubject<any>({});

  constructor(private http: HttpClient, private identityService: IdentityService, private snackBar: MatSnackBar) {}

  setOrderList(orders: any[]) {
    this.orderListSubject.next(orders);
  }

  getOrderList() {
    return this.orderListSubject.asObservable();
  }

  setOrder(orders: any) {
    this.orderSubject.next(orders);
  }

  getOrder() {
    return this.orderSubject.asObservable();
  }

  async fetchOrders() {
    try {
      const orders: any = await lastValueFrom(this.http.get(apiURL + '/orders', {
        headers: {
          'Authorization': 'Bearer ' + this.identityService.getToken()
        }
      }));
      this.setOrderList(orders);
    }
    catch (error) {
      this.snackBar.open('Nu s-au putut incarca comenzile', 'Close', {
        duration: 3000
      });
    }
  }

  async fetchOrderByOrderNumber(orderNumber: number) {
    try {
      const order: any = await lastValueFrom(this.http.get(apiURL + '/orders/' + orderNumber, {
        headers: {
          'Authorization': 'Bearer ' + this.identityService.getToken()
        }
      }));
      order.ticketList.forEach((ticket: any) => {
        if(ticket.ticketType.event === null) {
          ticket.ticketType.event = {
            title: 'Evenimentul a fost sters',
            date: '',
            location: {name: ''}
          }
        }
      });
      this.setOrder(order);
    }
    catch (error) {
      this.snackBar.open('Comanda nu a fost gasita', 'Close', {
        duration: 3000
      });
    }
  }

  async cancelTicket(ticket: any) {
    this.http.put(apiURL + '/tickets/' + ticket.id + '/cancel', null, {
      headers: {
        'Authorization': 'Bearer ' + this.identityService.getToken()
      }
    }).subscribe({
      next: () => {
        ticket.status = 'CANCELED';
        this.snackBar.open('Biletul a fost anulat cu succes!', 'Close', {
          duration: 3000
        });
      },
      error: (error: any) => {
        this.snackBar.open(error.error, 'Close', {
          duration: 3000
        });
      }
    });
  }

  async cancelOrder(order: any) {
    this.http.put(apiURL + '/orders/' + Number(order.orderNumber) + '/cancel', null, {
      headers: {
        'Authorization': 'Bearer ' + this.identityService.getToken()
      }
    }).subscribe({
      next: () => {
        order.status = 'CANCELED';
        this.snackBar.open('Comanda a fost anulata cu succes', 'Close', {
          duration: 3000
        });
      },
      error: (error: any) => {
        this.snackBar.open(error.error, 'Close', {
          duration: 3000
        });
      }
    });
  }
}
