import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AccountDetailsService} from "./account-details.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router, RouterLink} from "@angular/router";
import {DatePipe, NgForOf} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {EditAccountDetailsComponent} from "./edit-account-details/edit-account-details.component";
import {
  ChangePasswordAccountDetailsComponent
} from "./change-password-account-details/change-password-account-details.component";
import {Chart, ChartConfiguration} from "chart.js";

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
export class AccountDetailsComponent implements OnInit, AfterViewInit {
  user: any = {};
  orderList: any = [];

  constructor(private accountDetailsService: AccountDetailsService, private snackBar: MatSnackBar, private router: Router,
              private dialog: MatDialog) { }
  ngOnInit() {
    this.accountDetailsService.fetchUser().subscribe({
      next: (user: any) => {
        this.user = user;
        this.orderList = user.orderList.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 4);
        this.createPieChart();
      },
      error: (error: any) => {
        this.snackBar.open(error.error, 'Close', {
          duration: 3000
        });
      }
    });
  }

  ngAfterViewInit() {
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
          'rgba(75, 192, 192, 0.6)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)'
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

  onEditClick() {
    let dialogRef = this.dialog.open(EditAccountDetailsComponent, {
      width: '60%',
      data: this.user
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.accountDetailsService.editUser(result).subscribe({
          next: (user: any) => {
            this.user = user;
            this.snackBar.open('Informatiile contului au fost modificate', 'Close', {
              duration: 3000
            });
          },
          error: (error: any) => {
            this.snackBar.open(error.error, 'Close', {duration: 3000});
          }
        });
      }
    });
  }

  onChangePasswordClick() {
    let dialogRef = this.dialog.open(ChangePasswordAccountDetailsComponent, {
      width: '60%',
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.accountDetailsService.changePassword(result).subscribe({
          next: () => {
            this.snackBar.open('Parola a fost schimbata', 'Close', {
              duration: 3000
            });
          },
          error: (error: any) => {
            this.snackBar.open(error.error, 'Close', {duration: 3000});
          }
        });
      }
    });
  }
}
