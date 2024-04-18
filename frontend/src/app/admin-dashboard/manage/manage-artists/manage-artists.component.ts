import {AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";

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
export class ManageArtistsComponent implements OnInit, AfterViewInit, OnDestroy {
  private artistSubscription: Subscription | undefined;

  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  itemsCount = 0;

  displayedColumns: string[] = ['name', 'genreList'];

  rowData: any;

  searchValue: string = '';
  selectedFilterOption: string = 'name';
  shouldDisplayRemoveFilterButton: boolean = false;

  pageIndex = 0;
  pageSize = 5;

  columnMap: {
    [key: string]: string
  } = {
    name: 'Nume',
    genreList: 'Gen',
  };

  constructor(private dialog: MatDialog,
              private manageArtistsService: ManageArtistsService,
              private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(async (params) => {
      this.pageIndex = params['page'] || 0;
      this.pageSize = params['size'] || 5;
      this.searchValue = params['search'] || '';
      this.selectedFilterOption = params['filter'] || 'name';
      this.shouldDisplayRemoveFilterButton = !!(params['filter'] && params['search']);

      if (this.searchValue === '' && this.selectedFilterOption === 'name') {
        await this.fetchArtists();
      }
      else {
        await this.fetchFilteredArtists();
      }
      this.artistSubscription = this.manageArtistsService.getArtistListSubject().subscribe({
        next: (response: any) => {
          this.dataSource.data = response.artistPage.content;
          this.itemsCount = response.count;
        }
      });
    });
  }

  async fetchArtists() {
    await this.manageArtistsService.fetchPaginatedArtists(this.pageIndex, this.pageSize);
  }

  async fetchFilteredArtists() {
    await this.manageArtistsService.fetchPaginatedArtistsFiltered(this.pageIndex, this.pageSize, this.searchValue, this.selectedFilterOption);
  }

  ngOnDestroy() {
    this.artistSubscription?.unsubscribe();
  }

  ngAfterViewInit() {
    this.paginator.length = this.itemsCount;
    this.paginator.pageIndex = this.pageIndex;
    this.paginator.pageSize = this.pageSize;
    this.dataSource.sort = this.sort;
  }

  onPageChange(event: any): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: event.pageIndex, size: event.pageSize },
      queryParamsHandling: 'merge'
    });
  }

  filterData() {
    if(this.searchValue === '') return;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: this.searchValue, filter: this.selectedFilterOption, page: 0, size: this.pageSize },
      queryParamsHandling: 'merge'
    });
  }

  @HostListener('document:keydown', ['$event'])
  handleDeleteKeyboardEvent(event: KeyboardEvent) {
    if(event.key === 'Enter') {
      this.filterData();
    }
  }

  removeFilter() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { filter: null, search: null, page: 0, size: this.pageSize },
      queryParamsHandling: 'merge'
    });
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
    dialogRef.afterClosed().subscribe(async (artist: any) => {
      if(artist) {
        artist.genreList = JSON.stringify(artist.genreList);
        await this.manageArtistsService.addArtist(artist, this.pageIndex, this.pageSize);
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
    dialogRef.afterClosed().subscribe(async (artist: any) => {
      if(artist) {
        await this.manageArtistsService.updateArtist(artist);
      }
    });
  }

  onDeleteClick() {
    let dialogRef = this.dialog.open(DeleteComponent, {
      width: '30%'
    });
    dialogRef.afterClosed().subscribe(async (result: any) => {
      if(result) {
        await this.manageArtistsService.deleteArtist(this.rowData.id, this.pageIndex, this.pageSize);
        if (this.dataSource.data.length === 0 && this.pageIndex > 0) {
          if (this.searchValue === '' && this.selectedFilterOption === 'name') {
            await this.router.navigate([], {
              relativeTo: this.route,
              queryParams: {page: this.pageIndex - 1, size: this.pageSize, search: null, filter: null},
              queryParamsHandling: 'merge'
            });
          }
          else {
            await this.router.navigate([], {
              relativeTo: this.route,
              queryParams: {page: this.pageIndex - 1, size: this.pageSize, search: this.searchValue, filter: this.selectedFilterOption},
              queryParamsHandling: 'merge'
            });
          }
        }
      }
    });
  }
}
