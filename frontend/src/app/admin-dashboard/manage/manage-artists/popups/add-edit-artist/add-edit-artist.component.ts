import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from "@angular/material/table";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MdbFormsModule} from "mdb-angular-ui-kit/forms";
import {NgForOf, NgIf} from "@angular/common";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AddEditUserComponent} from "../../../manage-users/popups/add-edit-user/add-edit-user.component";
import {ManageLocationsService} from "../../../manage-locations/manage-locations.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AddGenreComponent} from "../add-genre/add-genre.component";

@Component({
  selector: 'app-add-edit-artist',
  standalone: true,
  imports: [
    FormsModule,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatIconButton,
    MatRow,
    MatRowDef,
    MatTable,
    MdbFormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    MatHeaderCellDef
  ],
  templateUrl: './add-edit-artist.component.html',
  styleUrl: './add-edit-artist.component.scss'
})
export class AddEditArtistComponent implements OnInit {
  registrationForm: FormGroup;
  imageSrc:  string | ArrayBuffer | null = null;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  imageFile: File | null = null;
  isImageNull: boolean = false;

  dataSource = new MatTableDataSource<any>();

  constructor(public dialogRef: MatDialogRef<AddEditUserComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder, private manageLocationsService: ManageLocationsService,
              private snackBar: MatSnackBar, private dialog: MatDialog) {
    this.registrationForm = this.fb.group({
      name: [this.data.artist.name, [Validators.required, Validators.maxLength(50)]],
    });
  }

  ngOnInit() {
    this.dataSource.data = this.data.artist.genreList;
    this.imageSrc = this.data.artist.imageUrl;
    this.isImageNull = this.imageSrc === null;
  }

  onCloseClick() {
    this.dialogRef.close();
  }

  onConfirmClick() {
    this.registrationForm.markAllAsTouched();
    if (this.registrationForm.valid) {
      let artist = { ...this.registrationForm.value, id: this.data.artist.id, imageUrl: this.imageSrc , genreList: this.dataSource.data};

      if (this.imageFile === null && this.imageSrc != '') {
        this.dialogRef.close(artist);
      }
      else if (this.imageFile !== null) {
        artist = { ...artist, image: this.imageFile };
        this.dialogRef.close(artist);
      } else {
        this.isImageNull = true;
        setTimeout(() => {
          this.isImageNull = false;
        }, 2000);
      }
    }
  }

  onFileSelected(artist: any) {
    this.imageFile = artist.target.files[0];

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

  onAddGenre() {
    const dialogRef = this.dialog.open(AddGenreComponent);

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.dataSource.data = [...this.dataSource.data, result];
      }
    });
  }

  onDeleteGenre(genre: any) {
    this.dataSource.data = this.dataSource.data.filter((value: any) => value !== genre);
  }
}
