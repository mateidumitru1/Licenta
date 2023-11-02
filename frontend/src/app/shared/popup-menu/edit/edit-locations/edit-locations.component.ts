import {Component, Input, OnInit} from '@angular/core';
import {LocationService} from "../../../../events/location/location.service";

@Component({
  selector: 'app-edit-locations',
  templateUrl: './edit-locations.component.html',
  styleUrls: ['./edit-locations.component.css']
})
export class EditLocationsComponent implements OnInit{

  @Input() data: any = {};

  @Input() dialogRef: any = {};

  indexes: any = {};

  toEditData: any = {};


  constructor() { }

  ngOnInit() {
    this.indexes = Object.keys(this.data);
    this.indexes = this.indexes.filter( (index: string) => index !== 'id' && index !== 'eventList' );
    this.toEditData = {...this.data};
  }

  onFileSelected(event: any) {
    this.toEditData.image = event.target.files[0];
  }
}
