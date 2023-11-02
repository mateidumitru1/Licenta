import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-popup-menu',
  templateUrl: './popup-menu.component.html',
  styleUrls: ['./popup-menu.component.css']
})
export class PopupMenuComponent implements OnInit{

  toEditData: any = {};

  constructor(public  dialogRef: MatDialogRef<PopupMenuComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {title: string, rowData: any, indexes: string[],
                locations: {id: string,
                            name: string,
                            address: string}[] }) {}

  ngOnInit() {
    this.toEditData = {...this.data.rowData};
  }

  onFileSelected(event: any) {
    this.toEditData.image = event.target.files[0];
  }
}
