import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {AdminManageService} from "../admin-manage.service";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-admin-manage-events',
  templateUrl: './admin-manage-events.component.html',
  styleUrls: ['./admin-manage-events.component.css']
})
export class AdminManageEventsComponent implements OnInit, AfterViewInit{

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  events: any = [];

  displayedColumns: string[] = ['title', 'date', 'location', 'shortDescription','description'];

  constructor(private adminManageService: AdminManageService) {}

  ngOnInit() {
    this.adminManageService.fetchEvents().subscribe((events: any) => {
      this.events = events;
    });
  }

  ngAfterViewInit() {
    this.events.paginator = this.paginator;
  }
}
