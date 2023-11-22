import {Component, Input, OnInit} from '@angular/core';
import {TicketsService} from "./tickets.service";

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit{

  @Input() ticketTypes: {
    name: string;
    price: number;
    quantity: number;
  }[] = [];

  image: string = '';

  constructor(private ticketsService: TicketsService) {
  }

  ngOnInit() {
    this.ticketTypes.sort((a, b) => b.price - a.price);
  }

  buyTicket(ticketType: { name: string; price: number; quantity: number; }): void {
    this.ticketsService.buyTicket(ticketType).subscribe((ticket: any) => {
      this.image = 'data:image/jpeg;base64, ' + ticket.qr.image;
    }, error => {
      console.log(error);
    })
  }
}
