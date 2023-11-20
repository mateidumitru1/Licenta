import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-edit-buttons',
  templateUrl: './edit-buttons.component.html',
  styleUrls: ['./edit-buttons.component.css']
})
export class EditButtonsComponent {

  @Input() data: any = {};

  @Input() dialogRef: any = {};

  constructor() { }

  onEditConfirmClick() {
    this.dialogRef.close({isTrue: true, data: this.data});
  }

  onEditCancelClick() {
    this.dialogRef.close({isTrue: false});
  }
}
