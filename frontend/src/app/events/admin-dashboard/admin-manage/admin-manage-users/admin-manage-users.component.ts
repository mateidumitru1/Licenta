import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {AdminManageService} from "../admin-manage.service";
import {EventService} from "../../../event/event.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-admin-manage-users',
  templateUrl: './admin-manage-users.component.html',
  styleUrls: ['./admin-manage-users.component.css']
})
export class AdminManageUsersComponent implements OnInit{

  users: any[] = [];

  displayedColumns: string[] = ['username', 'firstName', 'lastName', 'email', 'role'];

  constructor(private adminManageService: AdminManageService) {}

  ngOnInit() {
    this.adminManageService.fetchUsers().subscribe((users: any) => {
      this.users = users;
    });
  }
}
