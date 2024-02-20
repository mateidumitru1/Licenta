import {Component, OnInit} from '@angular/core';
import {AccountOrdersService} from "../account-orders.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-account-order-details',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf,
    NgIf,
    NgClass
  ],
  templateUrl: './account-order-details.component.html',
  styleUrl: './account-order-details.component.scss'
})
export class AccountOrderDetailsComponent implements OnInit{

  order: any = {};

  constructor(private accountOrderService: AccountOrdersService, private snackBar: MatSnackBar, private route: ActivatedRoute) {}

  ngOnInit() {
    const orderNumber = Number(this.route.snapshot.url[this.route.snapshot.url.length - 1].path);
    this.accountOrderService.fetchOrderByOrderNumber(orderNumber).subscribe({
      next: (order: any) => {
        this.order = order;
      },
      error: (error: any) => {
        this.snackBar.open(error.error, 'Close', {
          duration: 3000
        });
      }
    });
  }

  cancelTicket(ticket: any) {
    this.accountOrderService.cancelTicket(ticket).subscribe({
      next: () => {
        ticket.status = 'CANCELED'
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

  cancelOrder() {
    this.accountOrderService.cancelOrder(this.order).subscribe({
      next: () => {
        this.order.status = 'CANCELED'
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
