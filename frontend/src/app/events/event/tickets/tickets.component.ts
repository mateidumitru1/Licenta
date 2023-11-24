import {Component, Input, OnInit} from '@angular/core';
import {TicketsService} from "./tickets.service";
import {IdentityService} from "../../../identity/identity.service";
import {CookieService} from "ngx-cookie-service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit{

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

  constructor(private ticketsService: TicketsService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.event.ticketTypes.sort((a, b) => b.price - a.price);
  }

  addTicketToCart(ticketType: { id: string, name: string; price: number; quantity: number, event: any;}): void {
    this.ticketsService.buyTicket(ticketType)?.subscribe((ticket: any) => {
      this.snackBar.open('Ticket added to shopping cart!', 'Dismiss', {duration: 3000});},
      error => {
      this.snackBar.open('Error while buying ticket', 'Dismiss', {duration: 3000});
    });
  }
}
