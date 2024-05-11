import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {ShoppingCartService} from "./shopping-cart.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'
})
export class ShoppingCartComponent implements OnInit, OnDestroy  {
  private shoppingCartSubscription: Subscription | undefined;

  shoppingCart: any = {};

  constructor(private shoppingCartService: ShoppingCartService, private snackBar: MatSnackBar) {}

  async ngOnInit() {
    await this.shoppingCartService.fetchShoppingCart();
    this.shoppingCartSubscription = this.shoppingCartService.getShoppingCart().subscribe((shoppingCart) => {
      this.shoppingCart = shoppingCart;
    });
  }

  ngOnDestroy() {
    this.shoppingCartSubscription?.unsubscribe();
  }

  generateQuantityList(currentQuantity: number): number[] {
    const quantityList = [];
    for (let i = 1; i <= 10; i++) {
      if (i !== currentQuantity) {
        quantityList.push(i);
      }
    }
    return quantityList;
  }


  async onQuantityChange(event: any, shoppingCartItem: any) {
    shoppingCartItem.quantity = event.target.value;
    await this.shoppingCartService.updateQuantity(shoppingCartItem);
  }


  async removeFromCart(shoppingCartItem: any) {
    await this.shoppingCartService.removeTicketFromShoppingCart(shoppingCartItem.ticketType);
  }

  async onBuyClick() {
    await this.shoppingCartService.buyTickets();
  }
}
