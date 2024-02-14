import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {AdminManageService} from "../admin-manage.service";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatLineModule} from "@angular/material/core";
import {MatListModule} from "@angular/material/list";
import {MatCardModule} from "@angular/material/card";

@Component({
  selector: 'app-admin-manage-orders',
  standalone: true,
  imports: [CommonModule, MatInputModule, FormsModule, MatButtonModule, MatLineModule, MatListModule, MatCardModule],
  templateUrl: './admin-manage-orders.component.html',
  styleUrl: './admin-manage-orders.component.css'
})
export class AdminManageOrdersComponent implements OnInit{

    orders: any[] = [];

    orderNumber: string = '';

    userId: string = '';

    constructor(private adminManageService: AdminManageService, private snackBar: MatSnackBar) {}

    ngOnInit() {
    }

    fetchById() {
      this.orders = [];
      if(this.orderNumber === '') return;
      this.adminManageService.fetchOrderByNumber(this.orderNumber).subscribe((res: any ) => {
        this.orders.push(res);
        this.snackBar.open('Order fetched successfully', 'Close', { duration: 3000 });
        console.log(this.orders);
        }, (error) => {
          this.snackBar.open('Error fetching order', 'Close', { duration: 3000 });
      });
    }

    fetchByUserId() {
      this.orders = [];
      if(this.userId === '') return;
      this.adminManageService.fetchOrdersByUserId(this.userId).subscribe((res: any) => {
        this.orders = res;
        this.snackBar.open('Orders fetched successfully', 'Close', { duration: 3000 });
        console.log(this.orders);
        }, (error) => {
          this.snackBar.open('Error fetching orders', 'Close', { duration: 3000 });
      });
    }

  cancelOrder(order: any) {
    this.adminManageService.cancelOrder(order).subscribe(() => {
      order.status = 'CANCELED';
      order.ticketList.forEach((ticket: any) => {
        ticket.status = 'CANCELED';
      });
      this.snackBar.open('Order cancelled successfully', 'Close', { duration: 3000 });
    }, (error) => {
      this.snackBar.open('Error cancelling order', 'Close', { duration: 3000 });
    });
  }

  cancelTicket(ticket: any) {
    this.adminManageService.cancelTicket(ticket).subscribe(() => {
      ticket.status = 'CANCELED';
      this.snackBar.open('Ticket cancelled successfully', 'Close', { duration: 3000 });
    }, (error) => {
      this.snackBar.open('Error cancelling ticket', 'Close', { duration: 3000 });
    });

  }
}
