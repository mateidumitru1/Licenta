import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {AdminManageService} from "../admin-manage.service";
import {EventService} from "../../../event/event.service";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, AfterViewInit {

  @Input() data: any[] = [];

  @Input() displayedColumns: string[] = [];

  actions: string[] = ['Edit', 'Delete'];

  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  @ViewChild(MatSort) sort: MatSort | undefined;

  searchText: string = '';

  constructor() {}

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
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator!;
    this.dataSource.sort = this.sort!;
  }

  applyFilter() {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }
}
