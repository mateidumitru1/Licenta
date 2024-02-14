import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {OrdersService} from "./orders.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit{

  orders: any[] = [];

  constructor(private ordersService: OrdersService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.ordersService.fetchOrders().subscribe((orders: any) => {
      this.orders = orders;
    }, (error) => {
      this.snackBar.open('Error fetching orders', 'Close', {
        duration: 3000
      });
    });
    this.orders.forEach((order) => {
      order.isVisible = false;
    });
  }

  cancelTicket(ticket: any) {
    this.ordersService.cancelTicket(ticket).subscribe((response: any) => {
      this.orders = this.orders.filter((order) => order.id !== ticket.id);
      this.snackBar.open('Ticket cancelled', 'Close', {
        duration: 3000
      });
    }, (error) => {
      this.snackBar.open('Error cancelling ticket', 'Close', {
        duration: 3000
      });
    });
  }

  cancelOrder(order: any) {
    const { visible, ... orderToSend } = order;
    this.ordersService.cancelOrder(orderToSend).subscribe((response: any) => {
      this.orders = this.orders.filter((o) => o.id !== order.id);
      this.snackBar.open('Order cancelled', 'Close', {
        duration: 3000
      });
    }, (error) => {
      this.snackBar.open('Error cancelling order', 'Close', {
        duration: 3000
      });
    });
  }
}
