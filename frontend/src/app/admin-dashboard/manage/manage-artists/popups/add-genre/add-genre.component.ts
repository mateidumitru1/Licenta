import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MdbFormsModule} from "mdb-angular-ui-kit/forms";
import {NgForOf, NgIf} from "@angular/common";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ManageGenresService} from "../../manage-genres.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-add-genre',
  standalone: true,
  imports: [
    FormsModule,
    MdbFormsModule,
    NgIf,
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './add-genre.component.html',
  styleUrl: './add-genre.component.scss'
})
export class AddGenreComponent implements OnInit, OnDestroy {
  private genreListSubscription: Subscription | undefined;

  registrationForm: FormGroup;

  genreList: any = [];

  constructor(public dialogRef: MatDialogRef<AddGenreComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder, private manageGenresService: ManageGenresService) {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  async ngOnInit() {
    await this.manageGenresService.fetchGenres();
    this.genreListSubscription = this.manageGenresService.getGenreList().subscribe((genreList: any) => {
      this.genreList = genreList;
    });
  }

  ngOnDestroy() {
    this.genreListSubscription?.unsubscribe();
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
