import {Component, OnDestroy, OnInit} from '@angular/core';
import {EditAccountDetailsComponent} from "../../account/account-details/edit-account-details/edit-account-details.component";
import {
  ChangePasswordAccountDetailsComponent
} from "../../account/account-details/change-password-account-details/change-password-account-details.component";
import {AccountDetailsService} from "../../account/account-details/account-details.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {Subscription} from "rxjs";
import {AccountSettingsService} from "./account-settings.service";

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.scss'
})
export class AccountSettingsComponent implements OnInit, OnDestroy {
  private userSubscription: Subscription | undefined;

  user: any = {};

  constructor(private accountSettingsService: AccountSettingsService,
              private dialog: MatDialog) {}

  async ngOnInit() {
    await this.accountSettingsService.fetchUser();
    this.userSubscription = this.accountSettingsService.getUser().subscribe((user: any) => {
      this.user = user;
    });
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
  }

  onEditClick() {
    let dialogRef = this.dialog.open(EditAccountDetailsComponent, {
      width: '60%',
      data: this.user
    });
    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result) {
        await this.accountSettingsService.editUser(result);
      }
    });
  }

  onChangePasswordClick() {
    let dialogRef = this.dialog.open(ChangePasswordAccountDetailsComponent, {
      width: '60%',
    });
    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result) {
        await this.accountSettingsService.changePassword(result);
      }
    });
  }
}
