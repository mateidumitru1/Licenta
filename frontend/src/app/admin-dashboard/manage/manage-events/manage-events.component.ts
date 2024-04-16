import {AfterViewInit, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
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
import {ManageEventsService} from "./manage-events.service";
import {LocationNamePipe} from "../../../util/pipes/location-name.pipe";
import {AddEditEventComponent} from "./popup/add-edit-event/add-edit-event.component";
import {DeleteComponent} from "../shared/delete/delete.component";
import {LoadingComponent} from "../../../shared/loading/loading.component";
import {ActivatedRoute, Router} from "@angular/router";
import {parse} from "date-fns";

@Component({
  selector: 'app-manage-events',
  standalone: true,
  imports: [
    FormsModule,
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
    MatHeaderCellDef,
    MatMenuTrigger,
    LocationNamePipe,
    NgIf,
    LoadingComponent
  ],
  templateUrl: './manage-events.component.html',
  styleUrl: './manage-events.component.scss'
})
export class ManageEventsComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  itemsCount = 0;

  displayedColumns: string[] = ['title', 'date', 'location'];

  rowData: any;

  searchValue: string = '';
  selectedFilterOption: string = 'title';
  shouldDisplayRemoveFilterButton: boolean = false;

  pageIndex = 0;
  pageSize = 5;

  columnMap: {
    [key: string]: string
  } = {
    title: 'Titlu',
    date: 'Data',
    location: 'Locatie'
  };

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar,
              private manageEventsService: ManageEventsService,
              private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.pageIndex = params['page'] || 0;
      this.pageSize = params['size'] || 5;
      this.searchValue = params['search'] || '';
      this.selectedFilterOption = params['filter'] || 'title';
      this.shouldDisplayRemoveFilterButton = !!(params['filter'] && params['search']);

      if(this.searchValue === '' && this.selectedFilterOption === 'title') {
        this.fetchEvents();
      }
      else {
        this.fetchFilteredEvents();
      }
    });
  }

  fetchEvents() {
    this.manageEventsService.fetchPaginatedEvents(this.pageIndex, this.pageSize).subscribe({
      next: (response: any) => {
        this.dataSource.data = response.eventPage.content;
        this.itemsCount = response.count;
      },
      error: (error: any) => {
        this.snackBar.open(error.error, 'Close', {
          duration: 3000
        });
      }
    });
  }

  fetchFilteredEvents() {
    this.manageEventsService.fetchPaginatedEventsFiltered(this.pageIndex, this.pageSize, this.selectedFilterOption, this.searchValue).subscribe({
      next: (response: any) => {
        this.dataSource.data = response.eventPage.content;
        this.itemsCount = response.count;
      },
      error: (error: any) => {
        this.snackBar.open(error.error, 'Close', {
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
    if(this.selectedFilterOption === 'date') {
      const dateFormats = ['yyyy-MM-dd', 'dd/MM/yyyy', 'dd.MM.yyyy', 'yyyy.MM.dd', ];

      for (const format of dateFormats) {
        const parsedDate = parse(this.searchValue, format, new Date());

      }
    }
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
    let dialogRef = this.dialog.open(AddEditEventComponent, {
      height: '80%',
      width: '60%',
      data: {
        title: 'Adauga eveniment'
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((event: any) => {
      if(event) {
        event.ticketTypesList = JSON.stringify(event.ticketTypesList);
        this.manageEventsService.addEvent(event, this.pageIndex, this.pageSize).subscribe({
          next: (response: any) => {
            this.dataSource.data = response.eventPage.content;
            this.itemsCount = response.count;
            this.snackBar.open('Eveniment adaugat cu succes', 'Inchide', {duration: 3000});
          },
          error: (error: any) => {
            this.snackBar.open('A aparut o eroare la adaugarea evenimentului', 'Inchide', {duration: 3000});
          }
        });
      }
    });
  }

  onEditClick() {
    let dialogRef = this.dialog.open(AddEditEventComponent, {
      height: '80%',
      width: '60%',
      data: {
        eventId: this.rowData.id,
        title: 'Modifica eveniment'
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((event: any) => {
      if(event) {
        this.manageEventsService.updateEvent(event).subscribe({
          next: (event: any) => {
            this.dataSource.data = this.dataSource.data.map((e: any) => {
              if(e.id === event.id) {
                return event;
              }
              return e;
            });
            this.snackBar.open('Eveniment modificat cu succes', 'Inchide', {duration: 3000});
          },
          error: (error: any) => {
            this.snackBar.open('A aparut o eroare la modificarea evenimentului', 'Inchide', {duration: 3000});
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
        this.manageEventsService.deleteEvent(this.rowData.id, this.pageIndex, this.pageSize).subscribe({
          next: (response: any) => {
            if(response.eventPage.content.length === 0) {
              this.router.navigate([], {
                relativeTo: this.route,
                queryParams: { page: this.pageIndex - 1, size: this.pageSize },
                queryParamsHandling: 'merge'
              });
            }
            else {
              this.dataSource.data = response.eventPage.content;
              this.itemsCount = response.count;
            }
            this.snackBar.open('Eveniment sters cu succes', 'Inchide', {duration: 3000});
          },
          error: (error: any) => {
            this.snackBar.open('A aparut o eroare la stergerea evenimentului', 'Inchide', {duration: 3000});
          }
        });
      }
    });
  }
}
