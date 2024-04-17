import {AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
import {Subscription} from "rxjs";

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
export class ManageUsersComponent implements OnInit, AfterViewInit, OnDestroy {
  private userListSubscription: Subscription | undefined;

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
    this.route.queryParams.subscribe(async (params) => {
      this.pageIndex = params['page'] || 0;
      this.pageSize = params['size'] || 5;
      this.searchValue = params['search'] || '';
      this.selectedFilterOption = params['filter'] || 'firstName';
      this.shouldDisplayRemoveFilterButton = !!(params['filter'] && params['search']);

      if (this.searchValue === '' && this.selectedFilterOption === 'firstName') {
        await this.fetchUsers();
      } else {
        await this.fetchFilteredUsers();
      }
      this.userListSubscription = this.manageUsersService.getUsersListSubject().subscribe({
        next: (users: any) => {
          this.dataSource.data = users.userPage.content;
          this.itemsCount = users.count;
        }
      });
    });
  }

  async fetchUsers() {
    await this.manageUsersService.fetchPaginatedUsers(this.pageIndex, this.pageSize);
  }

  async fetchFilteredUsers() {
    await this.manageUsersService.fetchPaginatedUsersFiltered(this.pageIndex, this.pageSize, this.selectedFilterOption, this.searchValue);
  }

  ngOnDestroy() {
    this.userListSubscription?.unsubscribe();
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
    dialogRef.afterClosed().subscribe(async (user: any) => {
      if(user) {
        await this.manageUsersService.addUser(user, this.pageIndex, this.pageSize);
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
    dialogRef.afterClosed().subscribe(async (user: any) => {
      if(user) {
        await this.manageUsersService.updateUser(user);
      }
    });
  }

  onDeleteClick() {
    let dialogRef = this.dialog.open(DeleteComponent, {
      width: '30%'
    });
    dialogRef.afterClosed().subscribe(async (result: any) => {
      if(result) {
        await this.manageUsersService.deleteUser(this.rowData.id, this.pageIndex, this.pageSize);
        if (this.dataSource.data.length === 0 && this.pageIndex > 0) {
          this.pageIndex = this.pageIndex - 1;
        }
      }
    });
  }
}
