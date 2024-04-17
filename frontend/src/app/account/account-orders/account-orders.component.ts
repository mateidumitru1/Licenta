import {Component, OnDestroy, OnInit} from '@angular/core';
import {AccountOrdersService} from "./account-orders.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {MdbCollapseModule} from "mdb-angular-ui-kit/collapse";
import {MdbDropdownModule} from "mdb-angular-ui-kit/dropdown";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-account-orders',
  standalone: true,
  imports: [
    NgForOf,
    DatePipe,
    CurrencyPipe,
    RouterLink,
    NgIf,
    MdbCollapseModule,
    MdbDropdownModule
  ],
  templateUrl: './account-orders.component.html',
  styleUrl: './account-orders.component.scss'
})
export class AccountOrdersComponent implements OnInit, OnDestroy {
  private orderListSubscription: Subscription | undefined;

  orders: any[] = [];
  filteredOrders: any[] = [];
  currentPage = 1;
  itemsPerPage = 5;

  selectedFilter: string = 'last3Months';

  constructor(private accountOrderService: AccountOrdersService, private snackBar: MatSnackBar) {}

  filterOptions: any[] = [
    { value: 'last3Months', label: 'Ultimele 3 luni' },
    { value: 'last6Months', label: 'Ultimele 6 luni' },
    { value: 'lastYear', label: 'Ultimul an' },
    { value: 'all', label: 'Toate' }
  ];

  async ngOnInit() {
    await this.accountOrderService.fetchOrders();
    this.orderListSubscription = this.orderListSubscription = this.accountOrderService.getOrderList().subscribe(orders => {
      this.orders = orders;
    });
  }

  ngOnDestroy() {
    this.orderListSubscription?.unsubscribe();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredOrders.length / this.itemsPerPage);
  }

  get pageNumbers(): number[] {
    const pagesToShow = Math.min(3, this.totalPages); // Show at most 3 pages

    const startPage = Math.max(1, this.currentPage - 1);
    const endPage = Math.min(this.totalPages, startPage + pagesToShow - 1);

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

  get paginatedOrders(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredOrders.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
    }
  }

  onFilterChange(): void {
    this.currentPage = 1;
  }

  getSelectedFilterLabel(): string {
    const selectedOption = this.filterOptions.find(option => option.value === this.selectedFilter);
    return selectedOption ? selectedOption.label : 'All Time';
  }
}
