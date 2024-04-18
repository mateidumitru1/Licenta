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
import {AddArtistComponent} from "../add-artist/add-artist.component";
import {ManageEventsService} from "../../manage-events.service";

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
  registrationForm!: FormGroup;
  imageSrc: string | ArrayBuffer | null = null;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  imageFile: File | null = null;
  isImageNull: boolean = false;
  locations: any;
  broadGenres: any;
  event: any;
  today: any;
  ticketsDataSource = new MatTableDataSource<any>();
  artistsDataSource = new MatTableDataSource<any>();

  constructor(
    public dialogRef: MatDialogRef<AddEditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private manageLocationsService: ManageLocationsService,
    private manageEventsService: ManageEventsService,
    private dialog: MatDialog
  ) { }

  async ngOnInit() {
    this.registrationForm = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      location: ['', Validators.required],
      broadGenre: ['', Validators.required],
      shortDescription: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.today = new Date().toISOString().split('T')[0];
    this.locations = await this.manageLocationsService.fetchAllLocations();
    this.broadGenres = await this.manageEventsService.fetchAllBroadGenres();

    if (this.data.eventId !== undefined) {
      this.event = await this.manageEventsService.fetchEventById(this.data.eventId);
      this.ticketsDataSource.data = this.event.ticketTypeList;
      this.artistsDataSource.data = this.event.artistList;
      this.imageSrc = this.event.imageUrl;
      this.isImageNull = this.imageSrc === null;
      this.registrationForm.patchValue({
        title: this.event.title,
        date: this.event.date,
        location: this.event.location.name,
        broadGenre: this.event.broadGenre,
        shortDescription: this.event.shortDescription,
        description: this.event.description
      });
    }
  }

  onCloseClick() {
    this.dialogRef.close();
  }

  onConfirmClick() {
    this.registrationForm.markAllAsTouched();

    if (this.registrationForm.valid) {
      let event = { ...this.registrationForm.value,
        id: this.data.eventId,
        imageUrl: this.imageSrc ,
        ticketTypesList: this.ticketsDataSource.data.map((ticketType: any) => {
          return {
            id: ticketType.id,
            name: ticketType.name,
            price: ticketType.price,
            quantity: ticketType.remainingQuantity
          };
        }),
        artistIdList: this.artistsDataSource.data.map((artist: any) => artist.id)
      };

      event.locationId = this.locations.find((location: any) => location.name === event.location).id;
      event.broadGenreId = this.broadGenres.find((genre: any) => genre.name === event.broadGenre).id;

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
        this.ticketsDataSource.data = [...this.ticketsDataSource.data, ticketType];
      }
    });
  }

  onDeleteTicketTypeClick(data: any) {
    this.ticketsDataSource.data = this.ticketsDataSource.data.filter((value: any) => value !== data);
  }

  onAddArtistClick() {
    const dialogRef = this.dialog.open(AddArtistComponent);

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.artistsDataSource.data = [...this.artistsDataSource.data, result];
      }
    });
  }

  onDeleteArtistClick(data: any) {
    this.artistsDataSource.data = this.artistsDataSource.data.filter((value: any) => value !== data);
  }
}
