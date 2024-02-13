import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute} from "@angular/router";
import {ValidateService} from "./validate.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-validate',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './validate.component.html',
  styleUrl: './validate.component.css'
})
export class ValidateComponent implements OnInit{

  ticketId: string = '';

  constructor(private route: ActivatedRoute, private validateService: ValidateService, private SnackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.ticketId = this.route.snapshot.params['ticketId'];
    this.validateService.validateTicket(this.ticketId).subscribe(
      (data) => {
        if (data == true) {
          this.SnackBar.open('Ticket is valid', 'Close', {
            duration: 3000
          });
        }
        else {
          this.SnackBar.open('Ticket is NOT valid', 'Close', {
            duration: 3000
          });
        }
      },
      (error) => {
        this.SnackBar.open('Error while validating', 'Close', {
          duration: 3000
        });
      }
    );
  }

}
