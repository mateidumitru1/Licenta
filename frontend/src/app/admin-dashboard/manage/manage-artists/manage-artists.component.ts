import {Component, OnInit, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {LoadingComponent} from "../../../shared/loading/loading.component";
import {LocationNamePipe} from "../../../util/pipes/location-name.pipe";
import {MatButton} from "@angular/material/button";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from "@angular/material/table";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {NgForOf, NgIf} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DeleteComponent} from "../shared/delete/delete.component";
import {ManageArtistsService} from "./manage-artists.service";
import {AddEditArtistComponent} from "./popups/add-edit-artist/add-edit-artist.component";
import {GenreListNamesPipe} from "../../../util/pipes/genre-list-names.pipe";

@Component({
  selector: 'app-manage-artists',
  standalone: true,
  imports: [
    FormsModule,
    LoadingComponent,
    LocationNamePipe,
    MatButton,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatMenu,
    MatMenuItem,
    MatPaginator,
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable,
    NgForOf,
    NgIf,
    MatMenuTrigger,
    MatHeaderCellDef,
    GenreListNamesPipe
  ],
  templateUrl: './manage-artists.component.html',
  styleUrl: './manage-artists.component.scss'
})
export class ManageArtistsComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  displayedColumns: string[] = ['name', 'genreList'];

  rowData: any;

  searchValue: string = '';
  selectedFilterOption: string = 'name';

  columnMap: {
    [key: string]: string
  } = {
    name: 'Nume',
    genreList: 'Gen',
  };

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar,
              private manageArtistsService: ManageArtistsService) {}

  ngOnInit() {
    this.manageArtistsService.fetchArtists().subscribe({
      next: (artists: any) => {
        this.dataSource.data = artists;
        this.dataSource.sort = this.sort!;
        this.dataSource.paginator = this.paginator!;
      },
      error: (error: any) => {
        this.snackBar.open(error.error, 'Close', {
          duration: 3000
        });
      }
    });
  }

  applyFilter(searchValue: string, selectedFilterOption: string) {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      switch (selectedFilterOption) {
        case 'name':
          return data.name.toLowerCase().includes(filter);
        case 'genre':
          return data.genreList.some((genre: any) => genre.name.toLowerCase().includes(filter));
        default:
          return data.name.toLowerCase().includes(filter) ||
            data.address.toLowerCase().includes(filter);
      }
    };
    this.dataSource.filter = searchValue.trim().toLowerCase();
  }

  onAddClick() {
    let dialogRef = this.dialog.open(AddEditArtistComponent, {
      width: '60%',
      data: {
        artist: {name: '', imageUrl: '', genreList: []},
        title: 'Adauga artist'
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((artist: any) => {
      if(artist) {
        artist.genreList = JSON.stringify(artist.genreList);
        this.manageArtistsService.addArtist(artist).subscribe({
          next: (artist: any) => {
            this.dataSource.data = [...this.dataSource.data, artist];
            this.snackBar.open('Artist adaugat cu succes', 'Inchide', {duration: 3000});
          },
          error: (error: any) => {
            this.snackBar.open('A aparut o eroare la adaugarea artistului', 'Inchide', {duration: 3000});
          }
        });
      }
    });
  }

  onEditClick() {
    let dialogRef = this.dialog.open(AddEditArtistComponent, {
      width: '60%',
      data: {
        artist: this.rowData,
        title: 'Modifica artist'
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((artist: any) => {
      if(artist) {
        this.manageArtistsService.updateArtist(artist).subscribe({
          next: (artist: any) => {
            this.dataSource.data = this.dataSource.data.map((a: any) => {
              if(a.id === artist.id) {
                return artist;
              }
              return a;
            });
            this.snackBar.open('Artist modificat cu succes', 'Inchide', {duration: 3000});
          },
          error: (error: any) => {
            this.snackBar.open('A aparut o eroare la modificarea artistului', 'Inchide', {duration: 3000});
          }
        });
      }
    });
  }

  onDeleteClick() {
    let dialogRef = this.dialog.open(DeleteComponent, {
      width: '30%'
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if(result) {
        this.manageArtistsService.deleteArtist(this.rowData.id).subscribe({
          next: () => {
            this.dataSource.data = this.dataSource.data.filter((a: any) => a.id !== this.rowData.id);
            this.snackBar.open('Artist sters cu succes', 'Inchide', {duration: 3000});
          },
          error: (error: any) => {
            this.snackBar.open('A aparut o eroare la stergerea artistului', 'Inchide', {duration: 3000});
          }
        });
      }
    });
  }
}
