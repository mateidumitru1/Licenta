import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {AddService} from "../add.service";
import {InputFieldsErrorService} from "../../../../../../shared/input-fields-error/input-fields-error.service";
import {MatDialog} from "@angular/material/dialog";
import {AddTicketTypeComponent} from "./add-ticket-type/add-ticket-type.component";
import {MatTableDataSource} from "@angular/material/table";

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
    description: string,
    ticketTypes: {
      name: string,
      price: number,
      quantity: number
    }[],
  } = {
    title: '',
    date: '',
    location: '',
    image: null,
    shortDescription: '',
    description: '',
    ticketTypes: []
  } as any;

  imageSrc: string | ArrayBuffer | null = null;

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  dataSource = new MatTableDataSource<any>();

  constructor(private addService: AddService, private inputFieldsErrorService: InputFieldsErrorService,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.addService.subject.subscribe(() => {
      this.event.ticketTypes = this.dataSource.data as { name: string; price: number; quantity: number }[];
      if(!(this.event.title && this.event.date && this.event.location
        && this.event.image && this.event.shortDescription && this.event.description)) {
        this.inputFieldsErrorService.subject.next('Please fill all fields!');
      }
      else if(this.event.ticketTypes.length === 0) {
        this.inputFieldsErrorService.subject.next('Please add at least one ticket type!');
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

  onAddTicketTypeClick() {
    let dialogRef = this.dialog.open(AddTicketTypeComponent, {
      width: '40%',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.dataSource.data = [...this.dataSource.data, result];
      }
    });
  }

  onDeleteTicketTypeClick(data: any) {
    this.dataSource.data = this.dataSource.data.splice(this.dataSource.data.indexOf(data), 1);
  }
}
