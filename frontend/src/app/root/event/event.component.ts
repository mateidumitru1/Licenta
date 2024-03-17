import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {EventService} from "./event.service";
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {MatFormField} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {TicketService} from "./ticket.service";
import {LoadingComponent} from "../../shared/loading/loading.component";

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [
    NgIf,
    CurrencyPipe,
    NgForOf,
    MatFormField,
    FormsModule,
    MatInput,
    MatButton,
    MatIcon,
    LoadingComponent
  ],
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss'
})
export class EventComponent implements OnInit{
  event: any = {};

  descriptionIsVisible: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private eventService: EventService,
              private ticketService: TicketService) {}

  ngOnInit() {
    if(!this.route.snapshot.queryParams['id']) {
      this.router.navigate(['/page-not-found']);
    }
    this.route.queryParams.subscribe( {
      next: (params: any) => {
        this.eventService.fetchEventById(this.route.snapshot.queryParams['id']).subscribe({
          next: (event: any) => {
            this.event = event;
            this.event.ticketTypes.forEach((ticket: any) => {
              ticket.reservedQuantity = 0;
            });
            this.event.ticketTypes.sort((a: any, b: any) => b.price - a.price);
          },
          error: (error: any) => {
            if(error.status === 404 && error.error === 'Event not found') {
              this.router.navigate(['/page-not-found']);
            }
          }
        });
      }
    });
  }

  toggleDescription() {
    this.descriptionIsVisible = !this.descriptionIsVisible;
  }

  incrementQuantity(ticket: any) {
    if(ticket.quantity > ticket.reservedQuantity && ticket.reservedQuantity < 10) {
      ticket.reservedQuantity++;
    }
  }

  decrementQuantity(ticket: any) {
    if(ticket.reservedQuantity > 0) {
      ticket.reservedQuantity--;
    }
  }

  buyTickets() {
    let selectedTicketTypes: any[] = [];
    this.event.ticketTypes.forEach((ticket: any) => {
      if(ticket.reservedQuantity > 0) {
        selectedTicketTypes.push({
          ticketTypeId: ticket.id,
          quantity: ticket.reservedQuantity
        });
      }
      ticket.reservedQuantity = 0;
    });
    this.ticketService.buyTickets(selectedTicketTypes);
  }
}
