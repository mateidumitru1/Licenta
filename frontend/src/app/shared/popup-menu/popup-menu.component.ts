import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AdminManageService} from "../../events/admin-dashboard/admin-manage/admin-manage.service";

@Component({
  selector: 'app-popup-menu',
  templateUrl: './popup-menu.component.html',
  styleUrls: ['./popup-menu.component.css']
})
export class PopupMenuComponent implements OnInit{

  toEditData: any = {};

  constructor(public dialogRef: MatDialogRef<PopupMenuComponent>,
              private adminManageService: AdminManageService,
              @Inject(MAT_DIALOG_DATA)
              public data: { title: string, rowData: any, indexes: string[],
                locations: {id: string, name: string, address: string}[], type: string }) {}

  ngOnInit() {
    this.toEditData = {...this.data.rowData};
  }

  onDeleteConfirmClick() {
    this.dialogRef.close({isTrue: true})
  }

  onDeleteCancelClick() {
    this.dialogRef.close({isTrue: false});
  }
}
