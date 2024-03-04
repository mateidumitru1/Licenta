import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {IdentityService} from "../identity.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LoadingComponent} from "../../shared/loading/loading.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-resend-verify-account-email',
  standalone: true,
  imports: [
    LoadingComponent,
    NgIf
  ],
  templateUrl: './resend-verify-account-email.component.html',
  styleUrl: './resend-verify-account-email.component.scss'
})
export class ResendVerifyAccountEmailComponent implements OnInit {
  loading: boolean = true;


  constructor(private route: ActivatedRoute, private identityService: IdentityService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    const email = this.route.snapshot.params['email'];
    this.identityService.resendVerifyAccountEmail(email).subscribe({
      next: () => {
        this.loading = false;

      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
