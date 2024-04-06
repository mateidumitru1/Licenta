import {Component, OnInit, ViewChild} from '@angular/core';
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
import {ManageLocationsService} from "../manage-locations/manage-locations.service";
import {ManageEventsService} from "./manage-events.service";
import {LocationNamePipe} from "../../../util/pipes/location-name.pipe";
import {AddEditEventComponent} from "./popup/add-edit-event/add-edit-event.component";
import {DeleteComponent} from "../shared/delete/delete.component";
import {LoadingComponent} from "../../../shared/loading/loading.component";

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
export class ManageEventsComponent implements OnInit{
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  displayedColumns: string[] = ['title', 'date', 'location'];

  rowData: any;

  searchValue: string = '';
  selectedFilterOption: string = 'title';
  filteredData: any[] = [];

  columnMap: {
    [key: string]: string
  } = {
    title: 'Titlu',
    date: 'Data',
    location: 'Locatie'
  };

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar,
              private manageEventsService: ManageEventsService) {}

  ngOnInit() {
    this.manageEventsService.fetchEvents().subscribe({
      next: (events: any) => {
        console.log(events);
        this.dataSource.data = events;
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
        case 'title':
          return data.title.toLowerCase().includes(filter);
        case 'date':
          return data.date.toLowerCase().includes(filter);
        case 'location':
          return data.location.name.toLowerCase().includes(filter);
        default:
          return data.name.toLowerCase().includes(filter) ||
            data.address.toLowerCase().includes(filter);
      }
    };
    this.dataSource.filter = searchValue.trim().toLowerCase();
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
        this.manageEventsService.addEvent(event).subscribe({
          next: (event: any) => {
            this.dataSource.data = [...this.dataSource.data, event];
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
        this.manageEventsService.deleteEvent(this.rowData.id).subscribe({
          next: () => {
            this.dataSource.data = this.dataSource.data.filter((e: any) => e.id !== this.rowData.id);
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
