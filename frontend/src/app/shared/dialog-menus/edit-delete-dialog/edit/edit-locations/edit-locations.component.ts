import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {LocationService} from "../../../../../events/location/location.service";

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

  imageSrc: string | ArrayBuffer | null = null;

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  constructor() { }

  ngOnInit() {
    this.indexes = Object.keys(this.data);
    this.indexes = this.indexes.filter( (index: string) => index !== 'id' && index !== 'eventList' );
    this.toEditData = {...this.data};
  }

  onCancelButtonClick() {
    this.imageSrc = null;
    this.toEditData.image = null;
    this.fileInput.nativeElement.value = '';
  }

  onFileSelected(event: any) {
    this.toEditData.image = event.target.files[0];

    if (this.toEditData.image) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageSrc = reader.result;
      };
      reader.readAsDataURL(this.toEditData.image);
    }
  }
}
