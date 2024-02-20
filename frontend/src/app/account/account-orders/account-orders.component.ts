import {Component, OnInit} from '@angular/core';
import {AccountOrdersService} from "./account-orders.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CurrencyPipe, DatePipe, NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-account-orders',
  standalone: true,
  imports: [
    NgForOf,
    DatePipe,
    CurrencyPipe,
    RouterLink
  ],
  templateUrl: './account-orders.component.html',
  styleUrl: './account-orders.component.scss'
})
export class AccountOrdersComponent implements OnInit{

  orders: any[] = [];

  constructor(private accountOrderService: AccountOrdersService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.accountOrderService.fetchOrders().subscribe({
      next: (response: any) => {
        this.orders = response;
      },
      error: (error: any) => {
        this.snackBar.open(error.error.message, 'Close', {
          duration: 3000
        });
      }
    });
  }
}
