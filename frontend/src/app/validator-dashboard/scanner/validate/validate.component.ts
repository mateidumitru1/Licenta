import {Component, OnInit} from '@angular/core';
import {LoadingComponent} from "../../../shared/loading/loading.component";
import {NgIf} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {ValidateService} from "./validate.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-validate',
  standalone: true,
  imports: [
    LoadingComponent,
    NgIf
  ],
  templateUrl: './validate.component.html',
  styleUrl: './validate.component.scss'
})
export class ValidateComponent implements OnInit{
  loading: boolean = true;

  message: string = '';
  ticketId: string = '';

  constructor(private route: ActivatedRoute, private validateService: ValidateService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.ticketId = this.route.snapshot.params['ticketId'];
    this.validateService.validateTicket(this.ticketId).subscribe({
      next: (response) => {
        if(response == true) {
          this.message = 'Ticket is valid';
        }
        else {
          this.message = 'Ticket is NOT valid';
        }
      },
      error: (error) => {
        this.snackBar.open(error.error, 'Close', {duration: 3000});
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
