import {Component, OnInit, ViewChild} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatPaginator} from "@angular/material/paginator";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ManageUsersService} from "./manage-users.service";
import {NgForOf, NgIf, TitleCasePipe} from "@angular/common";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {LocationNamePipe} from "../../../util/pipes/location-name.pipe";
import {TruncateTextPipe} from "../../../util/pipes/truncate-text.pipe";
import {MatButton} from "@angular/material/button";
import {AddEditUserComponent} from "./popups/add-edit-user/add-edit-user.component";
import {MatDialog} from "@angular/material/dialog";
import {DeleteComponent} from "../shared/delete/delete.component";
import {MdbRadioModule} from "mdb-angular-ui-kit/radio";
import {FormsModule} from "@angular/forms";
import {LoadingComponent} from "../../../shared/loading/loading.component";

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [
    MatTable,
    MatHeaderCell,
    MatCell,
    MatHeaderCellDef,
    MatColumnDef,
    MatCellDef,
    MatMenuTrigger,
    MatPaginator,
    NgIf,
    NgForOf,
    TitleCasePipe,
    MatSort,
    MatSortHeader,
    LocationNamePipe,
    TruncateTextPipe,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatMenu,
    MatMenuItem,
    MatButton,
    MdbRadioModule,
    FormsModule,
    LoadingComponent
  ],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.scss'
})
export class ManageUsersComponent implements OnInit {
  loading: boolean = true;

  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  displayedColumns: string[] = ['firstName', 'lastName', 'username', 'email', 'role'];

  rowData: any;

  searchValue: string = '';
  selectedFilterOption: string = 'firstName';
  filteredData: any[] = [];

  columnMap: {
    [key: string]: string
  } = {
    firstName: 'Prenume',
    lastName: 'Nume',
    username: 'Username',
    email: 'Email',
    role: 'Rol'
  };

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar,
              private manageUsersService: ManageUsersService) {}

  ngOnInit() {
    this.manageUsersService.fetchUsers().subscribe({
      next: (users: any) => {
        this.dataSource.data = users;
        this.dataSource.sort = this.sort!;
        this.dataSource.paginator = this.paginator!;
      },
      error: (error: any) => {
        this.snackBar.open('Error fetching users', 'Close', {
          duration: 3000
        });
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  applyFilter(searchValue: string, selectedFilterOption: string) {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      switch (selectedFilterOption) {
        case 'firstName':
          return data.firstName.toLowerCase().includes(filter);
        case 'lastName':
          return data.lastName.toLowerCase().includes(filter);
        case 'username':
          return data.username.toLowerCase().includes(filter);
        case 'email':
          return data.email.toLowerCase().includes(filter);
        default:
          return data.firstName.toLowerCase().includes(filter) ||
            data.lastName.toLowerCase().includes(filter) ||
            data.username.toLowerCase().includes(filter) ||
            data.email.toLowerCase().includes(filter) ||
            data.role.toLowerCase().includes(filter);
      }
    };
    this.dataSource.filter = searchValue.trim().toLowerCase();
  }

  onAddClick() {
    let dialogRef = this.dialog.open(AddEditUserComponent, {
      width: '60%',
      data: {
        user: {id: '', firstName: '', lastName: '', username: '', email: '', role: ''},
        title: 'Adauga user'
      }
    });
    dialogRef.afterClosed().subscribe((user: any) => {
      if(user) {
        this.manageUsersService.addUser(user).subscribe({
          next: (response: any) => {
            this.snackBar.open('User added', 'Close', {
              duration: 3000
            });
          },
          error: (error: any) => {
            this.snackBar.open('Error adding user', 'Close', {
              duration: 3000
            });
          }
        });
        this.dataSource.data = [...this.dataSource.data, user];
      }
    });
  }


  onEditClick() {
    let dialogRef = this.dialog.open(AddEditUserComponent, {
      width: '60%',
      data: {
        user: this.rowData,
        title: 'Modifica user'
      }
    });
    dialogRef.afterClosed().subscribe((user: any) => {
      if(user) {
        this.manageUsersService.updateUser(user).subscribe({
          next: (response: any) => {
            this.dataSource.data = this.dataSource.data.map((data: any) => {
              if(data.id === user.id) {
                return user;
              }
              return data;
            });
            this.snackBar.open('User updated', 'Close', {
              duration: 3000
            });
          },
          error: (error: any) => {
            this.snackBar.open('Error updating user', 'Close', {
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
        this.manageUsersService.deleteUser(this.rowData.id).subscribe({
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
