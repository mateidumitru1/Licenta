import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {AdminManageService} from "../admin-manage.service";
import {EventService} from "../../../event/event.service";
import {MatSort} from "@angular/material/sort";
import {PopupMenuComponent} from "../../../../shared/popup-menu/popup-menu.component";
import {MatDialog} from "@angular/material/dialog";
import {LocationService} from "../../../location/location.service";
import {MatMenu, MatMenuTrigger} from "@angular/material/menu";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, AfterViewInit {

  @Input() data: any[] = [];

  @Input() displayedColumns: string[] = [];

  @Input() type: string = '';

  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  @ViewChild(MatSort) sort: MatSort | undefined;

  searchText: string = '';

  rowData: any;

  locations: {id: string,
              name: string,
              address: string}[] = [];

  constructor(private dialog: MatDialog, private locationService: LocationService,
              private adminManageService: AdminManageService) {}

  ngOnInit() {
    this.dataSource.data = this.data;
    this.dataSource.sortingDataAccessor = (item: any, property: string) => {
      if(property === 'date') {
        return new Date(item[property]);
      }
      if(item[property] === undefined) {
        return '';
      }
      return item[property].toLowerCase();
    }

    this.locationService.fetchAllLocations().subscribe((locations: any) => {
      this.locations = locations;
    });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator!;
    this.dataSource.sort = this.sort!;
  }

  onDataFiltered(filteredData: any[]) {
    this.dataSource.data = filteredData;
  }

  onClickEdit() {
    let indexes = this.displayedColumns;
    if(this.type !== 'users') {
      indexes = this.displayedColumns.concat(['imageUrl']);
    }
    let dialogRef = this.dialog.open(PopupMenuComponent, {
      width: '40%',
      data: {
        title: 'Edit',
        rowData: this.rowData,
        indexes: indexes,
        locations: this.locations,
        type: this.type
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.isTrue) {
        this.adminManageService.update(this.type, result.data).subscribe((res) => {
          this.dataSource.data = this.dataSource.data.map((value, key) => {
            if(value.id === res.id) {
              return res;
            }
            return value;
          });
        }, error => {
          console.log("update failed");
        });
      }
    });
  }

  onClickDelete() {
    let dialogRef = this.dialog.open(PopupMenuComponent, {
      width: '250px',
      data: {
        title: 'Delete',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.isTrue) {
        this.adminManageService.delete(this.type, this.rowData.id).subscribe((res: any) => {
          this.dataSource.data = this.dataSource.data.filter((value, key) => {
            return value.id !== this.rowData.id;
          });
        }, error => {
          console.log(error);
        });
      }
    });
  }
}
