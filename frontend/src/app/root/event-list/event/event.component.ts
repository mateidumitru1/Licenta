import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {EventService} from "../event.service";
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {MatFormField} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {TicketService} from "../ticket.service";
import {LoadingComponent} from "../../../shared/loading/loading.component";
import {Subscription} from "rxjs";

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
export class EventComponent implements OnInit, OnDestroy {
  private eventSubscription: Subscription | undefined;
  event: any = {};

  descriptionIsVisible: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router,
              private eventService: EventService,
              private ticketService: TicketService) {}

  ngOnInit() {
    this.route.queryParams.subscribe( async (params) => {
      if (!params['id']) {
        await this.router.navigate(['/page-not-found']);
      }

      await this.eventService.fetchEventById(params['id']);

      this.eventSubscription = this.eventService.getEvent().subscribe({
        next: (event: any) => {
          this.event = event;
          if(this.event.ticketTypeList) {
            this.event.ticketTypeList.forEach((ticket: any) => {
              ticket.reservedQuantity = 0;
            });
          }
        }
      });
    });
  }

  ngOnDestroy() {
    this.eventSubscription?.unsubscribe();
  }

  toggleDescription() {
    this.descriptionIsVisible = !this.descriptionIsVisible;
  }

  incrementQuantity(ticket: any) {
    if(ticket.remainingQuantity > ticket.reservedQuantity && ticket.reservedQuantity < 10) {
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
    this.event.ticketTypeList.forEach((ticket: any) => {
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
