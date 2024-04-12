import {AfterViewInit, Component, HostListener, OnInit, ViewChild} from '@angular/core';
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
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ManageLocationsService} from "./manage-locations.service";
import {AddEditLocationComponent} from "./popups/add-edit-location/add-edit-location.component";
import {DeleteComponent} from "../shared/delete/delete.component";
import {LoadingComponent} from "../../../shared/loading/loading.component";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-manage-locations',
  standalone: true,
  imports: [
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
    ReactiveFormsModule,
    FormsModule,
    MatHeaderCellDef,
    MatMenuTrigger,
    NgIf,
    LoadingComponent
  ],
  templateUrl: './manage-locations.component.html',
  styleUrl: './manage-locations.component.scss'
})
export class ManageLocationsComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  itemsCount = 0;

  displayedColumns: string[] = ['name', 'address'];

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
    address: 'Adresa'
  };

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar,
              private manageLocationsService: ManageLocationsService,
              private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.pageIndex = params['page'] || 0;
      this.pageSize = params['size'] || 5;
      this.searchValue = params['search'] || '';
      this.selectedFilterOption = params['filter'] || 'name';
      this.shouldDisplayRemoveFilterButton = !!(params['filter'] && params['search']);

      if(this.searchValue === '' && this.selectedFilterOption === 'name') {
        this.manageLocationsService.fetchPaginatedLocations(this.pageIndex, this.pageSize).subscribe({
          next: (response: any) => {
            this.dataSource.data = response.locationPage.content;
            this.itemsCount = response.count;
          },
          error: (error: any) => {
            this.snackBar.open('Error fetching locations', 'Close', {
              duration: 3000
            });
          }
        });
      }
      else {
        this.manageLocationsService.fetchPaginatedLocationsFiltered(this.pageIndex, this.pageSize, this.selectedFilterOption, this.searchValue).subscribe({
          next: (response: any) => {
            this.dataSource.data = response.locationPage.content;
            this.itemsCount = response.count;
          },
          error: (error: any) => {
            this.snackBar.open('Error fetching locations', 'Close', {
              duration: 3000
            });
          }
        });
      }
    });
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
    let dialogRef = this.dialog.open(AddEditLocationComponent, {
      width: '60%',
      data: {
        location: {name: '', address: '', imageUrl: ''},
        title: 'Adauga locatie'
      }
    });
    dialogRef.afterClosed().subscribe((location: any) => {
      if(location) {
        this.manageLocationsService.addLocation(location).subscribe({
          next: (response: any) => {
            this.dataSource.data.push(response);
            this.dataSource.data = this.dataSource.data;
            this.snackBar.open('Location added successfully', 'Close', {
              duration: 3000
            });
          },
          error: (error: any) => {
            this.snackBar.open('Error adding location', 'Close', {
              duration: 3000
            });
          }
        });
      }
    });
  }

  onEditClick() {
    let dialogRef = this.dialog.open(AddEditLocationComponent, {
      width: '60%',
      data: {
        location: this.rowData,
        title: 'Modifica locatia'
      }
    });
    dialogRef.afterClosed().subscribe((location: any) => {
      if (location) {
        this.manageLocationsService.editLocation(location).subscribe({
          next: (response: any) => {
            this.dataSource.data = this.dataSource.data.map((data: any) => {
              if (data.id === location.id) {
                return location;
              }
              return data;
            });
            this.snackBar.open('Location edited successfully', 'Close', {
              duration: 3000
            });
          },
          error: (error: any) => {
            this.snackBar.open('Error editing location', 'Close', {
              duration: 3000
            });
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
        this.manageLocationsService.deleteLocation(this.rowData.id).subscribe({
          next: (response: any) => {
            this.snackBar.open('Location deleted', 'Close', {
              duration: 3000
            });
          },
          error: (error: any) => {
            this.snackBar.open('Error deleting location', 'Close', {
              duration: 3000
            });
          }
        });
        this.dataSource.data = this.dataSource.data.filter((data: any) => data.id !== this.rowData.id);
      }
    });
  }
}
