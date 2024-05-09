import {Component, Inject, OnInit} from '@angular/core';
import {HomeAdminService} from "../../../admin-dashboard/home-admin/home-admin.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {EventListFilterService} from "./event-list-filter.service";
import {MatFormField, MatHint, MatLabel, MatSuffix} from "@angular/material/form-field";
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker
} from "@angular/material/datepicker";
import {MatInput} from "@angular/material/input";
import {provideNativeDateAdapter} from "@angular/material/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from "@angular/forms";

@Component({
  selector: 'app-event-list-filter',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    NgIf,
    MatLabel,
    MatDateRangeInput,
    MatHint,
    MatDatepickerToggle,
    MatDateRangePicker,
    MatSuffix,
    MatFormField,
    MatInput,
    MatDatepickerInput,
    MatDatepicker,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './event-list-filter.component.html',
  styleUrl: './event-list-filter.component.scss',
  providers: [provideNativeDateAdapter()]
})
export class EventListFilterComponent implements OnInit {
  navigationItems = ['Locatie', 'Artist', 'Gen', 'Data'];
  locations: any[] = [];
  artists: any[] = [];
  genres: any[] = [];

  selectedLocations: string[] = [];
  selectedArtists: string[] = [];
  selectedGenres: string[] = [];
  selectedStartDate: string = '';
  selectedEndDate: string = '';

  selectedItem: string = 'Locatie';

  range!: FormGroup;
  today: Date = new Date();

  filteredLocations: any;
  searchLocation: string = '';

  filteredArtists: any;
  searchArtist: string = '';

  filteredGenres: any;
  searchGenre: string = '';

  constructor(private dialogRef: MatDialogRef<EventListFilterComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private eventListFilterService: EventListFilterService,
              private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.eventListFilterService.getLocations().subscribe((locations: any) => {
      this.locations = locations;
      this.filteredLocations = locations;
    });
    this.eventListFilterService.getArtists().subscribe((artists: any) => {
      this.artists = artists;
      this.filteredArtists = artists;
    });
    this.eventListFilterService.getGenres().subscribe((genres: any) => {
      this.genres = genres;
      this.filteredGenres = genres;
    });
    if (this.data.location !== undefined) {
      this.selectedLocations = this.data.location.split(',');
    }
    if (this.data.artist !== undefined) {
      this.selectedArtists = this.data.artist.split(',');
    }
    if (this.data.genre !== undefined) {
      this.selectedGenres = this.data.genre.split(',');
    }
    if (this.data.startDate !== undefined) {
      this.selectedStartDate = this.data.startDate;
    }
    if (this.data.endDate !== undefined) {
      this.selectedEndDate = this.data.endDate;
    }

    this.range = this.formBuilder.group({
      start: [''],
      end: ['']
    });
  }

  close() {
    this.dialogRef.close();
  }

  onStartDateChange(): void {
    const startDateControl = this.range.get('start');
    const endDateControl = this.range.get('end');

    if (startDateControl && endDateControl) {
      const startDate = startDateControl.value;
      const endDate = endDateControl.value;

      if (startDate > endDate) {
        endDateControl.setValue(startDate);
      }
    }
    this.selectedStartDate = this.getFormattedDate(startDateControl?.value);
    this.selectedEndDate = this.getFormattedDate(endDateControl?.value);
  }

  onEndDateChange(): void {
    const startDateControl = this.range.get('start');
    const endDateControl = this.range.get('end');

    if (startDateControl && endDateControl) {
      const endDate = endDateControl.value;
      const startDate = startDateControl.value;

      if (endDate < startDate) {
        startDateControl.setValue(endDate);
      }
    }
    this.selectedStartDate = this.getFormattedDate(startDateControl?.value);
    this.selectedEndDate = this.getFormattedDate(endDateControl?.value);
  }

  getFormattedDate(inputDate: string): string {
    const date = new Date(inputDate);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  }

  toggleSelection(type: string, item: string) {
    let selectedArray: string[];

    switch (type) {
      case 'location':
        selectedArray = this.selectedLocations;
        break;
      case 'artist':
        selectedArray = this.selectedArtists;
        break;
      case 'genre':
        selectedArray = this.selectedGenres;
        break;
      default:
        return;
    }

    const index = selectedArray.indexOf(item);
    if (index === -1) {
      selectedArray.push(item);
    } else {
      selectedArray.splice(index, 1);
    }
  }

  removeFilter(type: string, value: string): void {
    switch (type) {
      case 'location':
        const locationIndex = this.selectedLocations.indexOf(value);
        if (locationIndex !== -1) {
          this.selectedLocations.splice(locationIndex, 1);
        }
        break;
      case 'artist':
        const artistIndex = this.selectedArtists.indexOf(value);
        if (artistIndex !== -1) {
          this.selectedArtists.splice(artistIndex, 1);
        }
        break;
      case 'genre':
        const genreIndex = this.selectedGenres.indexOf(value);
        if (genreIndex !== -1) {
          this.selectedGenres.splice(genreIndex, 1);
        }
        break;
      case 'date':
        this.selectedStartDate = '';
        this.selectedEndDate = '';
        this.range.reset();
        break;
      default:
        break;
    }
  }

  saveFilter() {
    const response = {
      selectedLocations: this.selectedLocations,
      selectedArtists: this.selectedArtists,
      selectedGenres: this.selectedGenres,
      selectedStartDate: this.selectedStartDate,
      selectedEndDate: this.selectedEndDate
    };
    this.dialogRef.close(response);
  }

  filter(type: string) {
    switch (type) {
      case 'locations':
        this.filteredLocations = this.locations.filter((location) => {
          return location.toLowerCase().includes(this.searchLocation.toLowerCase());
        });
        break;
      case 'artists':
        this.filteredArtists = this.artists.filter((artist) => {
           return artist.toLowerCase().includes(this.searchArtist.toLowerCase());
        });
        break;
      case 'genres':
        this.filteredGenres = this.genres.filter((genre) => {
          return genre.toLowerCase().includes(this.searchGenre.toLowerCase());
        });
        break;
      default:
        break;
    }
  }
}
