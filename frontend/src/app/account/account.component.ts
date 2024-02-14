import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatSidenavModule} from "@angular/material/sidenav";
import {RouterLink, RouterOutlet} from "@angular/router";
import {MatListModule} from "@angular/material/list";

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatSidenavModule, RouterLink, RouterOutlet, MatListModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {

}
