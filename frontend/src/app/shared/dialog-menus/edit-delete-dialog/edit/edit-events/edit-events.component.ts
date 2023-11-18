import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {LocationService} from "../../../../../events/location/location.service";

@Component({
  selector: 'app-edit-events',
  templateUrl: './edit-events.component.html',
  styleUrls: ['./edit-events.component.css']
})
export class EditEventsComponent implements OnInit{

  @Input() data: any = {};

  @Input() dialogRef: any = {};

  toEditData: any = {};

  indexes: any = {};

  locations: any = {};

  imageSrc: string | ArrayBuffer | null = null;

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  constructor(private locationService: LocationService) { }

  ngOnInit() {
    this.indexes = Object.keys(this.data);
    this.indexes = this.indexes.filter( (index: string) => index !== 'id');
    this.toEditData = {...this.data};

    this.locationService.fetchAllLocations().subscribe( (locations: any[]) => {
      this.locations = locations;
    });
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