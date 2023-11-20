import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {LocationService} from "../../../../../../location/location.service";

@Component({
  selector: 'app-edit-locations',
  templateUrl: './edit-locations.component.html',
  styleUrls: ['./edit-locations.component.css']
})
export class EditLocationsComponent implements OnInit{

  @Input() locationId: any = {};

  @Input() dialogRef: any = {};

  location: {
    id: string;
    name: string;
    address: string;
    imageUrl: string;
  } = {
    id: '',
    name: '',
    address: '',
    imageUrl: ''
  };

  toEditData: any = {};

  imageSrc: string | ArrayBuffer | null = null;

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  constructor(private locationService: LocationService) { }

  ngOnInit() {
    this.locationService.fetchLocationById(this.locationId).subscribe((location: any) => {
      this.location = location;
      this.toEditData = {...this.location};
    });
    this.toEditData = {...this.location};
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
