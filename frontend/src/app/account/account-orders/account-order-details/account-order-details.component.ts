import {Component, OnDestroy, OnInit} from '@angular/core';
import {AccountOrdersService} from "../account-orders.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-account-order-details',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf,
    NgIf,
    NgClass,
    RouterLink
  ],
  templateUrl: './account-order-details.component.html',
  styleUrl: './account-order-details.component.scss'
})
export class AccountOrderDetailsComponent implements OnInit, OnDestroy {
  private orderSubscription: Subscription | undefined;

  order: any = {};

  constructor(private accountOrderService: AccountOrdersService, private snackBar: MatSnackBar, private route: ActivatedRoute) {}

  async ngOnInit() {
    const orderNumber = Number(this.route.snapshot.url[this.route.snapshot.url.length - 1].path);
    await this.accountOrderService.fetchOrderByOrderNumber(orderNumber);
    this.orderSubscription = this.accountOrderService.getOrder().subscribe(order => {
      this.order = order;
    });
  }

  ngOnDestroy() {
    this.orderSubscription?.unsubscribe();
  }

  async cancelTicket(ticket: any) {
    await this.accountOrderService.cancelTicket(ticket);
  }

  async cancelOrder() {
    await this.accountOrderService.cancelOrder(this.order);
  }
}
