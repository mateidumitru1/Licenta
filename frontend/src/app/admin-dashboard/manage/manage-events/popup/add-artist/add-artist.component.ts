import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ManageGenresService} from "../../../manage-artists/manage-genres.service";
import {ManageArtistsService} from "../../../manage-artists/manage-artists.service";

@Component({
  selector: 'app-add-artist',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './add-artist.component.html',
  styleUrl: './add-artist.component.scss'
})
export class AddArtistComponent implements OnInit {
  registrationForm: FormGroup;

  artistList: any = [];

  constructor(public dialogRef: MatDialogRef<AddArtistComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder, private manageArtistsService: ManageArtistsService) {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  async ngOnInit() {
    await this.manageArtistsService.fetchArtistsWithoutEventGenre();
  }

  onCloseClick() {
    this.dialogRef.close();
  }

  onConfirmClick() {
    this.registrationForm.markAllAsTouched();
    if(this.registrationForm.valid) {
      this.dialogRef.close(this.registrationForm.value['name']);
    }
  }
}
