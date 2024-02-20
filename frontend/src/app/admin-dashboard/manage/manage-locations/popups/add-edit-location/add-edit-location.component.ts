import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MdbFormsModule} from "mdb-angular-ui-kit/forms";
import {NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AddEditUserComponent} from "../../../manage-users/popups/add-edit-user/add-edit-user.component";

@Component({
  selector: 'app-add-edit-location',
  standalone: true,
    imports: [
        MdbFormsModule,
        NgIf,
        ReactiveFormsModule
    ],
  templateUrl: './add-edit-location.component.html',
  styleUrl: './add-edit-location.component.scss'
})
export class AddEditLocationComponent implements OnInit {
  registrationForm: FormGroup;
  imageSrc:  string | ArrayBuffer | null = null;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  imageFile: File | null = null;
  isImageNull: boolean = false;

  constructor(public dialogRef: MatDialogRef<AddEditUserComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder) {
    this.registrationForm = this.fb.group({
      name: [this.data.location.name, Validators.required],
      address: [this.data.location.address, Validators.required]
    });
  }

  ngOnInit() {
    this.imageSrc = this.data.location.imageUrl;
    this.isImageNull = this.imageSrc === null;
  }

  onCloseClick() {
    this.dialogRef.close();
  }

  onConfirmClick() {
    this.registrationForm.markAllAsTouched();
    if (this.registrationForm.valid) {
      let location = { ...this.registrationForm.value, id: this.data.location.id, imageUrl: this.imageSrc };
      if(this.imageFile === null && this.imageSrc !== '') {
        this.dialogRef.close(location);
      }
      else if (this.imageFile !== null) {
        location = { ...location, image: this.imageFile };
        this.dialogRef.close(location);
      }
      else {
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
}
