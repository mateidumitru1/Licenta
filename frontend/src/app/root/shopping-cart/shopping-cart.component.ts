import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {ShoppingCartService} from "./shopping-cart.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

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
export class ShoppingCartComponent implements OnInit{
  shoppingCart: any = {};

  constructor(private shoppingCartService: ShoppingCartService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.shoppingCartService.fetchShoppingCart().subscribe({
      next: (shoppingCart) => {
        this.shoppingCart = shoppingCart;
      },
      error: (error) => {
        this.snackBar.open('Error while fetching shopping cart', 'Dismiss', {duration: 3000});
      }
    });
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


  onQuantityChange(event: any, shoppingCartItem: any) {
    shoppingCartItem.quantity = event.target.value;
    this.shoppingCartService.updateQuantity(shoppingCartItem)?.subscribe({
      next: (shoppingCart) => {
        this.shoppingCart = shoppingCart;
        this.snackBar.open('Quantity updated!', 'Dismiss', {duration: 3000});
      },
      error: error => {
        this.snackBar.open('Error while updating quantity', 'Dismiss', {duration: 3000});
      }
    });
  }


  removeFromCart(shoppingCartItem: any) {
    this.shoppingCartService.removeTicketFromShoppingCart(shoppingCartItem.ticketType)?.subscribe({
      next: (shoppingCart) => {
        this.shoppingCart = shoppingCart;
        this.snackBar.open('Ticket removed from shopping cart!', 'Dismiss', {duration: 3000});
      },
      error: error => {
        this.snackBar.open('Error while removing ticket from shopping cart', 'Dismiss', {duration: 3000});
      }
    });
  }

  onBuyClick() {
    this.shoppingCartService.buyTickets()?.subscribe({
      next: () => {
        this.snackBar.open('Tickets reserved!', 'Dismiss', {duration: 3000});
      },
      error: error => {
        this.snackBar.open('Error while reserving tickets', 'Dismiss', {duration: 3000});
      }
    });
    this.shoppingCart.shoppingCartItemList = [];
  }
}
