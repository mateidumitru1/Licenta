import { Component } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {InputFieldsErrorService} from "../../../../input-fields-error/input-fields-error.service";

@Component({
  selector: 'app-add-ticket-type',
  templateUrl: './add-ticket-type.component.html',
  styleUrls: ['./add-ticket-type.component.css']
})
export class AddTicketTypeComponent {
  ticketType: {
    name: string,
    price: number,
    quantity: number
  } = {} as any;

  constructor(private dialogRef: MatDialogRef<any>, private inputFieldsErrorService: InputFieldsErrorService) { }

  onConfirmClick() {
    if(!(this.ticketType.name && this.ticketType.price && this.ticketType.quantity)) {
      this.inputFieldsErrorService.subject.next('Please fill all fields!');
      return;
    }
    if(isNaN(this.ticketType.price)) {
      this.inputFieldsErrorService.subject.next('Price must be a number!');
      return;
    }
    if(isNaN(this.ticketType.quantity)) {
      this.inputFieldsErrorService.subject.next('Quantity must be a number!');
      return;
    }
    if(this.ticketType.price <= 0) {
      this.inputFieldsErrorService.subject.next('Price must be greater than 0!');
      return;
    }
    if(this.ticketType.quantity <= 0) {
      this.inputFieldsErrorService.subject.next('Quantity must be greater than 0!');
      return;
    }
    this.dialogRef.close(this.ticketType);
  }

  onCancelClick() {
    this.dialogRef.close();
  }
}
