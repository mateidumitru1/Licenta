import {Component, OnDestroy, OnInit} from '@angular/core';
import {AccountDetailsService} from "./account-details.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {RouterLink} from "@angular/router";
import {DatePipe, NgForOf} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {EditAccountDetailsComponent} from "./edit-account-details/edit-account-details.component";
import {
  ChangePasswordAccountDetailsComponent
} from "./change-password-account-details/change-password-account-details.component";
import {Chart, ChartConfiguration} from "chart.js";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [
    NgForOf,
    DatePipe,
    RouterLink
  ],
  templateUrl: './account-details.component.html',
  styleUrl: './account-details.component.scss'
})
export class AccountDetailsComponent implements OnInit, OnDestroy {
  private userSubscription: Subscription | undefined;

  user: any = {};
  orderList: any = [];

  constructor(private accountDetailsService: AccountDetailsService, private snackBar: MatSnackBar,
              private dialog: MatDialog) {}

  async ngOnInit() {
    await this.accountDetailsService.fetchUser();
    this.userSubscription = this.accountDetailsService.getUser().subscribe((user: any) => {
      this.user = user;
      this.orderList = this.user.orderList;
      this.createPieChart();
    });
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
  }

  createPieChart() {
    const genreData = {
      labels: this.user.genrePreferences.map((genre: any) => genre.broadGenre),
      datasets: [{
        data: this.user.genrePreferences.map((genre: any) => genre.percentage.toFixed(2)),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(201, 203, 207, 0.6)',
          'rgba(34, 43, 243, 0.6)',
          'rgba(120, 221, 45, 0.6)',
          'rgba(255, 140, 0, 0.6)',
          'rgba(0, 128, 128, 0.6)',
          'rgba(128, 0, 128, 0.6)',
          'rgba(255, 215, 0, 0.6)',
          'rgba(255, 192, 203, 0.6)',
          'rgba(0, 0, 255, 0.6)',
          'rgba(128, 128, 0, 0.6)',
          'rgba(0, 128, 0, 0.6)',
          'rgba(255, 0, 0, 0.6)',
          'rgba(0, 255, 0, 0.6)',
          'rgba(0, 0, 128, 0.6)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(201, 203, 207, 1)',
          'rgba(34, 43, 243, 1)',
          'rgba(120, 221, 45, 1)',
          'rgba(255, 140, 0, 1)',
          'rgba(0, 128, 128, 1)',
          'rgba(128, 0, 128, 1)',
          'rgba(255, 215, 0, 1)',
          'rgba(255, 192, 203, 1)',
          'rgba(0, 0, 255, 1)',
          'rgba(128, 128, 0, 1)',
          'rgba(0, 128, 0, 1)',
          'rgba(255, 0, 0, 1)',
          'rgba(0, 255, 0, 1)',
          'rgba(0, 0, 128, 1)'
        ],
        borderWidth: 1
      }]
    };

    const config: ChartConfiguration<'pie', number[], string> = {
      type: 'pie',
      data: genreData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
          },
        },
      },
    };

    const ctx = document.getElementById('genrePieChart') as HTMLCanvasElement;
    const myPieChart = new Chart(ctx, config);
  }
}
