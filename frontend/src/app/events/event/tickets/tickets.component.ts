import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent {

  @Input() ticketTypes: {
    name: string;
    price: number;
    quantity: number;
  }[] = [];

  constructor() {
  }

  buyTicket(ticketType: { name: string; price: number; quantity: number; }): void {
    console.log(ticketType);
  }
}
