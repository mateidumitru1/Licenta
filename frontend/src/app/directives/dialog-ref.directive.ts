import {Directive, Input} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Directive({
  selector: '[appDialogRef]'
})
export class DialogRefDirective {

  constructor(private dialogRef: MatDialogRef<any>) {}
  @Input() set appDialogRef(dialogRef: MatDialogRef<any>) {
    if(dialogRef) {
      this.dialogRef = dialogRef;
    }
  }
}
