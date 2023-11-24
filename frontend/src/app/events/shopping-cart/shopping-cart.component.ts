import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ShoppingCartService} from "./shopping-cart.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MatLineModule} from "@angular/material/core";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, MatLineModule, MatButtonModule, MatCardModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent implements OnInit{

  shoppingCart: {
    price: number;
    ticketTypeList: {
      id: string;
      name: string;
      price: number;
      quantity: number;
      event: any;
    }[];
  } = {
    price: 0,
    ticketTypeList: []
  };

  constructor(private shoppingCartService: ShoppingCartService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
      this.shoppingCartService.getShoppingCart()?.subscribe((shoppingCart: any) => {
        this.shoppingCart = shoppingCart;
      }, error => {
        this.snackBar.open('Error while fetching shopping cart', 'Dismiss', {duration: 3000});
      });
  }

  onRemoveClick(ticketType: { id: string, name: string; price: number; quantity: number; event: any; }) {
      this.shoppingCartService.removeTicketFromShoppingCart(ticketType)?.subscribe((shoppingCart: any) => {
        this.shoppingCart = shoppingCart;
        this.snackBar.open('Ticket removed from shopping cart!', 'Dismiss', {duration: 3000});
      }, error => {
        this.snackBar.open('Error while removing ticket from shopping cart', 'Dismiss', {duration: 3000});
      });
  }

  onBuyClick() {

  }
}
