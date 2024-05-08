import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {HeaderService} from "./header.service";
import {NavigationEnd, Router, RouterLink} from "@angular/router";
import {IdentityService} from "../../identity/identity.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LoadingComponent} from "../../shared/loading/loading.component";
import {FormsModule} from "@angular/forms";
import {DropdownService} from "./dropdown.service";
import {ShoppingCartService} from "../shopping-cart/shopping-cart.service";
import {Subscription} from "rxjs";
import {MdbTooltipModule} from "mdb-angular-ui-kit/tooltip";
import {MdbCollapseModule} from "mdb-angular-ui-kit/collapse";
import {FullSizeNavigationComponent} from "./full-size-navigation/full-size-navigation.component";
import {MobileSizeNavigationComponent} from "./mobile-size-navigation/mobile-size-navigation.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    RouterLink,
    LoadingComponent,
    FormsModule,
    MdbTooltipModule,
    MdbCollapseModule,
    NgClass,
    FullSizeNavigationComponent,
    MobileSizeNavigationComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private shoppingCartSubscription: Subscription | undefined;
  private headerDataSubscription: Subscription | undefined;

  locations: any[] = [];
  artists: any;
  broadGenres: any = [];

  shoppingCartSize!: number;

  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('searchDropdown') searchDropdown!: ElementRef;

  constructor(private headerService: HeaderService) {}

  async ngOnInit() {
    await this.headerService.fetchHeaderData();
    this.headerDataSubscription = this.headerService.getHeaderData().subscribe({
      next: (headerData: any) => {
        this.locations = headerData.locations;
        this.artists = headerData.artists;
        this.broadGenres = headerData.broadGenres;
      }
    });

    this.shoppingCartSubscription = this.headerService.getShoppingCartSize().subscribe({
      next: (shoppingCartSize: number) => {
        this.shoppingCartSize = shoppingCartSize;
      }
    });
  }

  ngOnDestroy() {
    this.shoppingCartSubscription?.unsubscribe();
    this.headerDataSubscription?.unsubscribe();
  }
}
