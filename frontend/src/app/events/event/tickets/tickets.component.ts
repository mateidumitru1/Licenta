import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {TicketsService} from "./tickets.service";
import {IdentityService} from "../../../identity/identity.service";
import {CookieService} from "ngx-cookie-service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnChanges{

  @Input()
  event!: {
    id: string;
    title: string;
    shortDescription: string;
    description: string;
    date: string;
    location: {
      id: string;
      name: string;
      address: string;
      imageUrl: string;
    };
    imageUrl: string;
    ticketTypes: {
      id: string;
      name: string;
      price: number;
      quantity: number;
      event: any;
    }[];
  };

  selectedTicketTypes: {
    ticketType: {
      id: string;
      name: string;
      price: number;
      quantity: number;
      event: any;
    };
    quantity: number;
  }[] = [];

  constructor(private ticketsService: TicketsService, private snackBar: MatSnackBar) {
  }


  ngOnChanges() {
    this.event.ticketTypes.sort((a, b) => b.price - a.price);
    this.selectedTicketTypes = this.event.ticketTypes.map(ticketType => {
      return {
        ticketType,
        quantity: 0
      };
    });
  }

  addTicketsToCart(): void {
    this.ticketsService.addTicketsToCart(this.selectedTicketTypes);
    this.selectedTicketTypes.forEach(ticket => ticket.quantity = 0);
  }

  decreaseQuantity(ticket: { ticketType: { id: string, name: string; price: number; quantity: number, event: any;}, quantity: number;}) {
    const selectedTicketType = this.selectedTicketTypes.find(selectedTicketType => selectedTicketType.ticketType.id === ticket.ticketType.id);
    if (selectedTicketType) {
      selectedTicketType.quantity--;
    }
  }

  increaseQuantity(ticket: { ticketType: { id: string, name: string; price: number; quantity: number, event: any;}, quantity: number;}) {
    const selectedTicketType = this.selectedTicketTypes.find(selectedTicketType => selectedTicketType.ticketType.id === ticket.ticketType.id);
    if (selectedTicketType) {
      selectedTicketType.quantity++;
    }
  }

}
