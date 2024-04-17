import {Component, OnDestroy, OnInit} from '@angular/core';
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
export class ManageOrdersComponent implements OnInit, OnDestroy {
  orders: any;
  orderNumber: string = '';
  userId: string = '';

  constructor(private manageOrdersService: ManageOrderService) {}

  ngOnInit() {
    this.orders = [];
  }

  ngOnDestroy() {
  }

  handleNullEvent(order: any) {
    if(order.ticketList == undefined) {
      return;
    }
    order.ticketList.forEach((ticket: any) => {
      if(ticket.ticketType.event == null) {
        ticket.ticketType.event = {
          title: 'Evenimentul a fost sters',
        };
      }
    });
    return order;
  }

  async fetchOrderByNumber() {
    if(this.orderNumber === '') return;
    this.orders = [];
    this.orders.push(this.handleNullEvent(await this.manageOrdersService.fetchOrderByNumber(this.orderNumber)));
  }

  async fetchOrderByUserId() {
    if(this.userId === '') return;

    this.orders = [];
    const response: any = await this.manageOrdersService.fetchOrdersByUserId(this.userId);

    if (response) {
      this.orders = response.map((order: any) => this.handleNullEvent(order));
    }
  }

  async cancelOrder(order: any) {
    order = await this.manageOrdersService.cancelOrder(order);
  }

  async cancelTicket(ticket: any) {
    ticket = await this.manageOrdersService.cancelTicket(ticket);
  }
}
