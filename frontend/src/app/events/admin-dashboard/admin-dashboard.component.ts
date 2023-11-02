import {Component, ElementRef} from '@angular/core';
import {IdentityService} from "../../identity/identity.service";

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  constructor(private identityService: IdentityService) {}

  logout() {
    this.identityService.logout();
  }
}
