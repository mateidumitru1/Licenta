import {Component, EventEmitter, Inject, Input, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AddService} from "./add.service";

@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.css']
})
export class AddDialogComponent {

  @Output() demandData: EventEmitter<any> = new EventEmitter<any>();

  dataToAdd: any = {};

  constructor(private dialogRef: MatDialogRef<any>,
              @Inject(MAT_DIALOG_DATA)
              public data: {indexes: string[], locations: {id: string, name: string, address: string}[], type: string},
              private addService: AddService) { }

  onClickConfirm() {
    this.addService.subject.next();
  }

  onClickCancel() {
    this.dialogRef.close({isTrue: false});
  }

  onConfirmEvent(data: any) {
    this.dialogRef.close({isTrue: true, data: data});
  }
}
