import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {ManageOrderService} from "./manage-order.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-manage-orders',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './manage-orders.component.html',
  styleUrl: './manage-orders.component.scss'
})
export class ManageOrdersComponent implements OnInit {

  orders: any[] = [];
  orderNumber: string = '';
  userId: string = '';

  constructor(private manageOrdersService: ManageOrderService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {

  }

  fetchOrderById() {
    this.orders = [];
    if(this.orderNumber === '') return;
    this.manageOrdersService.fetchOrderByNumber(this.orderNumber).subscribe({
      next: (order: any) => {
        this.orders.push(order);
        this.snackBar.open('Order fetched successfully', 'Close', {duration: 3000});
      },
      error: (error) => {
        this.snackBar.open('Error fetching order', 'Close', {duration: 3000});
      }
    });
  }

  fetchOrderByUserId() {
    this.orders = [];
    if(this.userId === '') return;
    this.manageOrdersService.fetchOrdersByUserId(this.userId).subscribe({
      next: (orders: any) => {
        this.orders = orders;
        this.snackBar.open('Orders fetched successfully', 'Close', {duration: 3000});
      },
      error: (error) => {
        this.snackBar.open(error.error, 'Close', {duration: 3000});
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
