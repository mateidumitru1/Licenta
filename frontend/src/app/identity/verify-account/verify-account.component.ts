import {Component, OnInit} from '@angular/core';
import {IdentityService} from "../identity.service";
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LoadingComponent} from "../../shared/loading/loading.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-verify-account',
  standalone: true,
  imports: [
    LoadingComponent,
    NgIf
  ],
  templateUrl: './verify-account.component.html',
  styleUrl: './verify-account.component.scss'
})
export class VerifyAccountComponent implements OnInit{
  loading: boolean = true;

  verified: boolean = false;
  constructor(private route: ActivatedRoute, private identityService: IdentityService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    const token = this.route.snapshot.params['token'];
    this.identityService.verifyAccount(token).subscribe({
      next: () => {
        this.verified = true;
      },
      error: (error) => {
        this.verified = false;
      },
      complete: () => {
        this.loading = false;
      }
    })
  }
}
