import { Component } from '@angular/core';
import {AdminManageService} from "../admin-manage.service";

@Component({
  selector: 'app-admin-manage-locations',
  templateUrl: './admin-manage-locations.component.html',
  styleUrls: ['./admin-manage-locations.component.css']
})
export class AdminManageLocationsComponent {

  locations: any[] = [];

  displayedColumns: string[] = ['name', 'address'];

  constructor(private adminManageService: AdminManageService) {}

  ngOnInit() {
    this.adminManageService.fetchLocations().subscribe((locations: any) => {
      this.locations = locations;
    });
  }
}
