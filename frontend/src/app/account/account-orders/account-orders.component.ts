import {Component, OnInit} from '@angular/core';
import {AccountOrdersService} from "./account-orders.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {MdbCollapseModule} from "mdb-angular-ui-kit/collapse";
import {MdbDropdownModule} from "mdb-angular-ui-kit/dropdown";

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
export class AccountOrdersComponent implements OnInit{

  orders: any[] = [];
  filteredOrders: any[] = [];
  currentPage = 1;
  itemsPerPage = 5;

  selectedFilter: string = 'last3Months';

  constructor(private accountOrderService: AccountOrdersService, private snackBar: MatSnackBar) {}

  // Define options for the filter dropdown
  filterOptions: any[] = [
    { value: 'last3Months', label: 'Ultimele 3 luni' },
    { value: 'last6Months', label: 'Ultimele 6 luni' },
    { value: 'lastYear', label: 'Ultimul an' },
    { value: 'all', label: 'Toate' }
  ];

  ngOnInit() {
    this.accountOrderService.fetchOrders().subscribe({
      next: (orders: any) => {
        this.orders = orders;
        this.filteredOrders = this.orders;
        this.orders.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
      },
      error: (error: any) => {
        this.snackBar.open(error.error.message, 'Close', {
          duration: 3000
        });
      }
    });
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
    this.filterOrders();
  }

  filterOrders(): void {
    const currentDate = new Date();
    switch (this.selectedFilter) {
      case 'last3Months':
        this.filteredOrders = this.orders.filter(order => {
          const orderDate = new Date(order.date);
          const threeMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, currentDate.getDate());
          return orderDate >= threeMonthsAgo;
        });
        break;
      case 'last6Months':
        this.filteredOrders = this.orders.filter(order => {
          const orderDate = new Date(order.date);
          const sixMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, currentDate.getDate());
          return orderDate >= sixMonthsAgo;
        });
        break;
      case 'lastYear':
        this.filteredOrders = this.orders.filter(order => {
          const orderDate = new Date(order.date);
          const oneYearAgo = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate());
          return orderDate >= oneYearAgo;
        });
        break;
      default:
        // For 'all', show all orders
        this.filteredOrders = [...this.orders];
        break;
    }
  }

  getSelectedFilterLabel(): string {
    const selectedOption = this.filterOptions.find(option => option.value === this.selectedFilter);
    return selectedOption ? selectedOption.label : 'All Time';
  }
}
