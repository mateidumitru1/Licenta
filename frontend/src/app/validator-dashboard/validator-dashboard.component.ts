import { Component } from '@angular/core';
import {SidebarComponent} from "../shared/sidebar/sidebar.component";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-validator-dashboard',
  standalone: true,
  imports: [
    SidebarComponent,
    RouterOutlet
  ],
  templateUrl: './validator-dashboard.component.html',
  styleUrl: './validator-dashboard.component.scss'
})
export class ValidatorDashboardComponent {
  menuItems: any[] = [
    { label: 'Acasa', route: 'validator-dashboard', icon: 'fa-solid fa-home fa-fw me-3' },
    { label: 'Validare', route: 'validator-dashboard/scanner', icon: 'fa-solid fa-qrcode fa-fw me-3' },
    { label: 'Setari', route: 'validator-dashboard/settings', icon: 'fa-solid fa-cog fa-fw me-3' }
  ];
}
