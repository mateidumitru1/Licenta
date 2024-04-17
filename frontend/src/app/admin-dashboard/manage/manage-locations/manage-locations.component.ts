import {AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
import {Subscription} from "rxjs";

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
export class ManageLocationsComponent implements OnInit, AfterViewInit, OnDestroy {
  private locationListSubscription: Subscription | undefined;

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
    this.route.queryParams.subscribe(async (params) => {
      this.pageIndex = params['page'] || 0;
      this.pageSize = params['size'] || 5;
      this.searchValue = params['search'] || '';
      this.selectedFilterOption = params['filter'] || 'name';
      this.shouldDisplayRemoveFilterButton = !!(params['filter'] && params['search']);

      if(this.searchValue === '' && this.selectedFilterOption === 'name') {
        await this.fetchLocations();
      }
      else {
        await this.fetchFilteredLocations();
      }
      this.locationListSubscription = this.manageLocationsService.getLocationsListSubject().subscribe((data: any) => {
        if(data) {
          this.dataSource.data = data.locationPage.content;
          this.itemsCount = data.count;
        }
      });
    });
  }

  async fetchLocations() {
    await this.manageLocationsService.fetchPaginatedLocations(this.pageIndex, this.pageSize);

  }

  async fetchFilteredLocations() {
    await this.manageLocationsService.fetchPaginatedLocationsFiltered(this.pageIndex, this.pageSize, this.selectedFilterOption, this.searchValue);
  }

  ngOnDestroy() {
    this.locationListSubscription?.unsubscribe();
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
    dialogRef.afterClosed().subscribe(async (location: any) => {
      if(location) {
        await this.manageLocationsService.addLocation(location, this.pageIndex, this.pageSize);
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
    dialogRef.afterClosed().subscribe(async (location: any) => {
      if (location) {
        await this.manageLocationsService.editLocation(location);
      }
    });
  }

  onDeleteClick() {
    let dialogRef = this.dialog.open(DeleteComponent, {
      width: '30%'
    });
    dialogRef.afterClosed().subscribe(async (result: any) => {
      if(result) {
        await this.manageLocationsService.deleteLocation(this.rowData.id, this.pageIndex, this.pageSize);
        if (this.dataSource.data.length === 0 && this.pageIndex > 0) {
          this.paginator.previousPage();
        }
      }
    });
  }
}
