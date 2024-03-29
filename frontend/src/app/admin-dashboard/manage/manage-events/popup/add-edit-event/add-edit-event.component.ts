import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MdbFormsModule} from "mdb-angular-ui-kit/forms";
import {NgForOf, NgIf} from "@angular/common";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AddEditUserComponent} from "../../../manage-users/popups/add-edit-user/add-edit-user.component";
import {ManageLocationsService} from "../../../manage-locations/manage-locations.service";
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow,
  MatHeaderRowDef, MatRow, MatRowDef,
  MatTable, MatTableDataSource
} from "@angular/material/table";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {AddTicketTypeComponent} from "../add-ticket-type/add-ticket-type.component";

@Component({
  selector: 'app-add-edit-event',
  standalone: true,
  imports: [
    FormsModule,
    MdbFormsModule,
    NgIf,
    ReactiveFormsModule,
    NgForOf,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatIconButton,
    MatIcon,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRow,
    MatRowDef
  ],
  templateUrl: './add-edit-event.component.html',
  styleUrl: './add-edit-event.component.scss'
})
export class AddEditEventComponent implements OnInit{
  registrationForm: FormGroup;
  imageSrc:  string | ArrayBuffer | null = null;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  imageFile: File | null = null;
  isImageNull: boolean = false;

  locations: any[] = [];

  today: any;

  dataSource = new MatTableDataSource<any>();

  constructor(public dialogRef: MatDialogRef<AddEditUserComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder, private manageLocationsService: ManageLocationsService,
              private snackBar: MatSnackBar, private dialog: MatDialog) {
    this.registrationForm = this.fb.group({
      title: [this.data.event.title, Validators.required],
      date: [this.data.event.date, Validators.required],
      location: [this.data.event.location.name, Validators.required],
      shortDescription: [this.data.event.shortDescription, Validators.required],
      description: [this.data.event.description, Validators.required]
    });
  }

  ngOnInit() {
    this.dataSource.data = this.data.event.ticketTypes;
    this.today = new Date().toISOString().split('T')[0];
    this.imageSrc = this.data.event.imageUrl;
    this.isImageNull = this.imageSrc === null;
    this.manageLocationsService.fetchLocations().subscribe({
      next: (locations: any) => {
        this.locations = locations;
      },
      error: (error: any) => {
        this.snackBar.open('A apărut o eroare la aducerea locațiilor', 'Închide', {duration: 3000});
      }
    });
  }

  onCloseClick() {
    this.dialogRef.close();
  }

  onConfirmClick() {
    this.registrationForm.markAllAsTouched();
    if (this.registrationForm.valid) {
      let event = { ...this.registrationForm.value, id: this.data.event.id, imageUrl: this.imageSrc , ticketTypesList: this.dataSource.data};
      event.locationId = this.locations.find((location: any) => location.name === event.location).id;
      delete event.location;
      if (this.imageFile === null && this.imageSrc != '') {
        this.dialogRef.close(event);
      }
      else if (this.imageFile !== null) {
        event = { ...event, image: this.imageFile };
        this.dialogRef.close(event);
      } else {
        this.isImageNull = true;
        setTimeout(() => {
          this.isImageNull = false;
        }, 2000);
      }
    }
  }

  onFileSelected(event: any) {
    this.imageFile = event.target.files[0];

    if(this.imageFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageSrc = reader.result;
      };
      reader.readAsDataURL(this.imageFile);
    }
  }

  removeImage() {
    this.imageSrc = '';
    this.imageFile = null;
    this.fileInput.nativeElement.value = '';
  }

  onAddTicketTypeClick() {
    let dialogRef = this.dialog.open(AddTicketTypeComponent, {
      width: '40%',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((ticketType: any) => {
      if(ticketType) {
        this.dataSource.data = [...this.dataSource.data, ticketType];
      }
    });
  }

  onDeleteTicketTypeClick(data: any) {
    this.dataSource.data = this.dataSource.data.filter((value: any) => value !== data);
  }
}
