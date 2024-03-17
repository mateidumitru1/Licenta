import {Component, OnInit, ViewChild} from '@angular/core';
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
import {ManageUsersService} from "../manage-users/manage-users.service";
import {ManageLocationsService} from "./manage-locations.service";
import {AddEditLocationComponent} from "./popups/add-edit-location/add-edit-location.component";
import {DeleteComponent} from "../shared/delete/delete.component";
import {LoadingComponent} from "../../../shared/loading/loading.component";

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
export class ManageLocationsComponent implements OnInit{
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  displayedColumns: string[] = ['name', 'address'];

  rowData: any;

  searchValue: string = '';
  selectedFilterOption: string = 'name';
  filteredData: any[] = [];

  columnMap: {
    [key: string]: string
  } = {
    name: 'Nume',
    address: 'Adresa'
  };

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar,
              private manageLocationsService: ManageLocationsService) {}

  ngOnInit() {
    this.manageLocationsService.fetchLocations().subscribe({
      next: (locations: any) => {
        this.dataSource.data = locations;
        this.dataSource.sort = this.sort!;
        this.dataSource.paginator = this.paginator!;
      },
      error: (error: any) => {
        this.snackBar.open('Error fetching users', 'Close', {
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
        case 'address':
          return data.address.toLowerCase().includes(filter);
        default:
          return data.name.toLowerCase().includes(filter) ||
            data.address.toLowerCase().includes(filter);
      }
    };
    this.dataSource.filter = searchValue.trim().toLowerCase();
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
            this.snackBar.open('User deleted', 'Close', {
              duration: 3000
            });
          },
          error: (error: any) => {
            this.snackBar.open('Error deleting user', 'Close', {
              duration: 3000
            });
          }
        });
        this.dataSource.data = this.dataSource.data.filter((data: any) => data.id !== this.rowData.id);
      }
    });
  }
}
