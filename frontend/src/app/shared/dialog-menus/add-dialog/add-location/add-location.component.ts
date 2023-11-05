import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {AddService} from "../add.service";
import {InputFieldsErrorService} from "../../../input-fields-error/input-fields-error.service";

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.css']
})
export class AddLocationComponent implements OnInit{

  @Output() confirmEvent: EventEmitter<any> = new EventEmitter<any>();

  location: {
    name: string,
    address: string,
    image: any
  } = {} as any;

  imageSrc: string | ArrayBuffer | null = null;

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  constructor(private addService: AddService, private inputFieldsErrorService: InputFieldsErrorService) { }

  ngOnInit() {
    this.addService.subject.subscribe(() => {
      if(!(this.location.name && this.location.address && this.location.image)) {
        this.inputFieldsErrorService.subject.next('Please fill all fields!');
      }
      else {
        this.confirmEvent.emit(this.location);
      }
    });
  }

  onCancelButtonClick() {
    this.imageSrc = null;
    this.location.image = null;
    this.fileInput.nativeElement.value = '';
  }

  onFileSelected(event: any) {
    this.location.image = event.target.files[0];

    if (this.location.image) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageSrc = reader.result;
      };
      reader.readAsDataURL(this.location.image);
    }
  }
}
