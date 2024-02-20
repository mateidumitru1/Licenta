import {Component, OnInit} from '@angular/core';
import {AccountDetailsService} from "./account-details.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {DatePipe, NgForOf} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {EditAccountDetailsComponent} from "./edit-account-details/edit-account-details.component";
import {
  ChangePasswordAccountDetailsComponent
} from "./change-password-account-details/change-password-account-details.component";

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [
    NgForOf,
    DatePipe
  ],
  templateUrl: './account-details.component.html',
  styleUrl: './account-details.component.scss'
})
export class AccountDetailsComponent implements OnInit{

  user: any = {};
  orderList: any = [];

  constructor(private accountDetailsService: AccountDetailsService, private snackBar: MatSnackBar, private router: Router,
              private dialog: MatDialog) { }
  ngOnInit() {
    this.accountDetailsService.fetchUser().subscribe({
      next: (user: any) => {
        this.user = user;
        this.orderList = user.orderList.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 4);
      },
      error: (error: any) => {
        this.snackBar.open(error.error, 'Close', {
          duration: 3000
        });
      }
    });
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
