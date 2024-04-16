import {AfterViewInit, Component, HostListener, OnInit, ViewChild} from '@angular/core';
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
import {MatPaginator, PageEvent} from "@angular/material/paginator";
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
import {ActivatedRoute, Router} from "@angular/router";

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
export class ManageUsersComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  itemsCount = 0;

  displayedColumns: string[] = ['firstName', 'lastName', 'username', 'email', 'role'];

  rowData: any;

  searchValue: string = '';
  selectedFilterOption: string = 'firstName';
  shouldDisplayRemoveFilterButton: boolean = false;

  pageIndex = 0;
  pageSize = 5;

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
              private manageUsersService: ManageUsersService,
              private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.pageIndex = params['page'] || 0;
      this.pageSize = params['size'] || 5;
      this.searchValue = params['search'] || '';
      this.selectedFilterOption = params['filter'] || 'firstName';
      this.shouldDisplayRemoveFilterButton = !!(params['filter'] && params['search']);

      if (this.searchValue === '' && this.selectedFilterOption === 'firstName') {
        this.fetchUsers();
      } else {
        this.fetchFilteredUsers();
      }
    });
  }

  fetchUsers() {
    this.manageUsersService.fetchPaginatedUsers(this.pageIndex, this.pageSize).subscribe({
      next: (response: any) => {
        this.dataSource.data = response.userPage.content;
        this.itemsCount = response.count
      },
      error: (error: any) => {
        this.snackBar.open('Error fetching users', 'Close', {
          duration: 3000
        });
      }
    });
  }

  fetchFilteredUsers() {
    this.manageUsersService.fetchPaginatedUsersFiltered(this.pageIndex, this.pageSize, this.selectedFilterOption, this.searchValue).subscribe({
      next: (response: any) => {
        this.dataSource.data = response.userPage.content;
        this.itemsCount = response.count;
      },
      error: (error: any) => {
        this.snackBar.open('Error fetching users', 'Close', {
          duration: 3000
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
    let dialogRef = this.dialog.open(AddEditUserComponent, {
      width: '60%',
      data: {
        user: {id: '', firstName: '', lastName: '', username: '', email: '', role: ''},
        title: 'Adauga user'
      }
    });
    dialogRef.afterClosed().subscribe((user: any) => {
      if(user) {
        this.manageUsersService.addUser(user, this.pageIndex, this.pageSize).subscribe({
          next: (response: any) => {
            this.dataSource.data = response.userPage.content;
            this.itemsCount = response.count
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
        this.manageUsersService.deleteUser(this.rowData.id, this.pageIndex, this.pageSize).subscribe({
          next: (response: any) => {
            if(response.userPage.content.length === 0) {
              this.router.navigate([], {
                relativeTo: this.route,
                queryParams: { page: this.pageIndex - 1, size: this.pageSize },
                queryParamsHandling: 'merge'
              });
            }
            else {
              this.dataSource.data = response.userPage.content;
              this.itemsCount = response.count
            }
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
      }
    });
  }
}
