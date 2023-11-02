import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-edit-users',
  templateUrl: './edit-users.component.html',
  styleUrls: ['./edit-users.component.css']
})
export class EditUsersComponent implements OnInit{

  @Input() data: any = {};

  @Input() dialogRef: any = {};

  indexes: any = {};

  toEditData: any = {};

  constructor() { }

  ngOnInit() {
    this.indexes = Object.keys(this.data);
    this.indexes = this.indexes.filter( (item:string) => item !== 'id');
    this.toEditData = {...this.data};
  }
}
