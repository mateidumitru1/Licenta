import { Component } from '@angular/core';
import {MdbCollapseModule} from "mdb-angular-ui-kit/collapse";
import {NgClass} from "@angular/common";
import {Router, RouterOutlet} from "@angular/router";
import {routes} from "../app.routes";
import {IdentityService} from "../identity/identity.service";
import {SidebarComponent} from "../shared/sidebar/sidebar.component";

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    MdbCollapseModule,
    NgClass,
    RouterOutlet,
    SidebarComponent
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {

  menuItems: any[] = [
    { label: 'Contul meu', route: 'account', icon: 'fa-solid fa-user fa-fw me-3' },
    { label: 'Comenzi', route: 'account/orders', icon: 'fa-solid fa-envelope fa-fw me-3' },
    { label: 'Setari', route: 'account/settings', icon: 'fa-solid fa-gear fa-fw me-3' }
  ];

  constructor() {}
}
