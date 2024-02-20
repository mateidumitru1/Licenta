import {Component, OnInit} from '@angular/core';
import {MdbCollapseModule} from "mdb-angular-ui-kit/collapse";
import {Router, RouterOutlet} from "@angular/router";
import {NgClass} from "@angular/common";
import {IdentityService} from "../identity/identity.service";
import {JwtHandler} from "../identity/jwt.handler";
import {SidebarComponent} from "../shared/sidebar/sidebar.component";

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    MdbCollapseModule,
    RouterOutlet,
    NgClass,
    SidebarComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {

  menuItems: any[] = [
    { label: 'Acasa', route: 'admin-dashboard', icon: 'fa-solid fa-home fa-fw me-3' },
    { label: 'Gestioneaza', icon: 'fa-solid fa-cogs fa-fw me-3', submenu: [
      { label: 'Utilizatori', route: 'admin-dashboard/manage/users', icon: 'fa-solid fa-user fa-fw me-3' },
      { label: 'Locatii', route: 'admin-dashboard/manage/locations', icon: 'fa-solid fa-map-marker fa-fw me-3' },
      { label: 'Evenimente', route: 'admin-dashboard/manage/events', icon: 'fa-solid fa-calendar fa-fw me-3' },
      { label: 'Comenzi', route: 'admin-dashboard/manage/orders', icon: 'fa-solid fa-envelope fa-fw me-3' }
      ]},
    { label: 'Statistici', route: 'admin-dashboard/statistics', icon: 'fa-solid fa-chart-bar fa-fw me-3' },
    { label: 'Setari', route: 'admin-dashboard/settings', icon: 'fa-solid fa-gear fa-fw me-3' }
  ];

  constructor(private identityService: IdentityService, private router: Router) { }

}
