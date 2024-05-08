import {Component, OnDestroy, OnInit} from '@angular/core';
import {AccountOrdersService} from "./account-orders.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
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
    MdbDropdownModule,
    NgClass
  ],
  templateUrl: './account-orders.component.html',
  styleUrl: './account-orders.component.scss'
})
export class AccountOrdersComponent implements OnInit, OnDestroy {
  private orderListSubscription: Subscription | undefined;

  orders: any[] = [];
  pageCount: number = 0;

  currentPage: number = 0;
  size: number = 5;

  selectedFilter: string = 'last3Months';

  constructor(private accountOrderService: AccountOrdersService,
              private route: ActivatedRoute,
              private router: Router) {}

  filterOptions: any[] = [
    { value: 'last3Months', label: 'Ultimele 3 luni' },
    { value: 'last6Months', label: 'Ultimele 6 luni' },
    { value: 'lastYear', label: 'Ultimul an' },
    { value: 'all', label: 'Toate' }
  ];

  ngOnInit() {
    this.route.queryParams.subscribe(async (params) => {
      this.currentPage = params['page'] || 0;
      this.selectedFilter = params['filter'] || 'last3Months';

      await this.accountOrderService.fetchOrders(this.currentPage, this.size, this.selectedFilter);
      this.orderListSubscription = this.accountOrderService.getOrderPage().subscribe((response: any) => {
        this.orders = response.orderPage.content;
        this.pageCount = Math.ceil(response.count / this.size);
      });
    });
  }

  getPageRange(pageCount: number): number[] {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  ngOnDestroy() {
    this.orderListSubscription?.unsubscribe();
  }

  getSelectedFilterLabel(): string {
    const selectedOption = this.filterOptions.find(option => option.value === this.selectedFilter);
    return selectedOption ? selectedOption.label : 'All Time';
  }

  onFilterChange() {
    this.router.navigate([], {
      queryParams: {
        page: this.currentPage,
        filter: this.selectedFilter
      },
      queryParamsHandling: 'merge'
    });
  }

  onPageChange(page: number) {
    this.router.navigate([], {
      queryParams: {
        page: page - 1,
        filter: this.selectedFilter
      },
      queryParamsHandling: 'merge'
    });
  }
}
