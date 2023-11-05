import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {AddService} from "../add.service";
import {InputFieldsErrorService} from "../../../input-fields-error/input-fields-error.service";

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent {

  @Output() confirmEvent: EventEmitter<any> = new EventEmitter<any>();

  @Input() locations: any;

  event: {
    title: string,
    date: string,
    location: string,
    image: any,
    shortDescription: string,
    description: string
  } = {} as any;

  imageSrc: string | ArrayBuffer | null = null;

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  constructor(private addService: AddService, private inputFieldsErrorService: InputFieldsErrorService) { }

  ngOnInit() {
    this.addService.subject.subscribe(() => {
      if(!(this.event.title && this.event.date && this.event.location
        && this.event.image && this.event.shortDescription && this.event.description)) {
        this.inputFieldsErrorService.subject.next('Please fill all fields!');
      }
      else {
        this.confirmEvent.emit(this.event);
      }
    });
  }

  onCancelButtonClick() {
    this.imageSrc = null;
    this.event.image = null;
    this.fileInput.nativeElement.value = '';
  }

  onFileSelected(event: any) {
    this.event.image = event.target.files[0];

    if (this.event.image) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageSrc = reader.result;
      };
      reader.readAsDataURL(this.event.image);
    }
  }
}
