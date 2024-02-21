import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {ManageOrderService} from "./manage-order.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LoadingComponent} from "../../../shared/loading/loading.component";

@Component({
  selector: 'app-manage-orders',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    LoadingComponent
  ],
  templateUrl: './manage-orders.component.html',
  styleUrl: './manage-orders.component.scss'
})
export class ManageOrdersComponent {
  loading: boolean = true;
  shouldDisplaySpinner: boolean = false;

  orders: any[] = [];
  orderNumber: string = '';
  userId: string = '';

  constructor(private manageOrdersService: ManageOrderService, private snackBar: MatSnackBar) {}

  handleNullEvent(order: any) {
    order.ticketList.forEach((ticket: any) => {
      if(ticket.ticketType.event == null) {
        ticket.ticketType.event = {
          title: 'Evenimentul a fost sters',
        };
      }
    });
    return order;
  }

  fetchOrderByNumber() {
    if(this.orderNumber === '') return;

    this.shouldDisplaySpinner = true;
    this.loading = true;

    this.orders = [];
    this.manageOrdersService.fetchOrderByNumber(this.orderNumber).subscribe({
      next: (order: any) => {
        console.log(order);
        this.orders.push(this.handleNullEvent(order));
        this.snackBar.open('Order fetched successfully', 'Close', {duration: 3000});
      },
      error: (error) => {
        this.snackBar.open('Error fetching order', 'Close', {duration: 3000});
      },
      complete: () => {
        this.shouldDisplaySpinner = false;
        this.loading = false;
      }
    });
  }

  fetchOrderByUserId() {
    if(this.userId === '') return;

    this.shouldDisplaySpinner = true;
    this.loading = true;

    this.orders = [];
    this.manageOrdersService.fetchOrdersByUserId(this.userId).subscribe({
      next: (orders: any) => {
        this.orders = orders.map((order: any) => this.handleNullEvent(order));
        this.orders = orders;
        this.snackBar.open('Orders fetched successfully', 'Close', {duration: 3000});
      },
      error: (error) => {
        this.snackBar.open(error.error, 'Close', {duration: 3000});
      },
      complete: () => {
        this.shouldDisplaySpinner = false;
        this.loading = false;
      }
    });
  }

  cancelTicket(ticket: any) {
    this.manageOrdersService.cancelTicket(ticket).subscribe({
      next: () => {
        ticket.status = 'CANCELED';
        this.snackBar.open('Ticket canceled successfully', 'Close', {duration: 3000});
      },
      error: (error) => {
        this.snackBar.open(error.error, 'Close', {duration: 3000});
      }
    });
  }

  cancelOrder(order: any) {
    this.manageOrdersService.cancelOrder(order).subscribe({
      next: () => {
        order.status = 'CANCELED';
        order.ticketList.forEach((ticket: any) => {
          ticket.status = 'CANCELED';
        });
        this.snackBar.open('Order canceled successfully', 'Close', {duration: 3000});
      },
      error: (error) => {
        this.snackBar.open(error.error, 'Close', {duration: 3000});
      }
    });
  }
}
