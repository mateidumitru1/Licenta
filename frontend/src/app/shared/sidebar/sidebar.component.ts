import {Component, Input, OnInit} from '@angular/core';
import {MdbCollapseModule} from "mdb-angular-ui-kit/collapse";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {IdentityService} from "../../identity/identity.service";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MdbCollapseModule,
    NgClass,
    NgForOf,
    NgIf,
    RouterLink
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {

  @Input() menuItems: any[] = [];
  @Input() brand: string = '';
  activePage: string | null = null;

  page: string = 'to do';

  constructor(private router: Router, private route: ActivatedRoute, private identityService: IdentityService) {}

  ngOnInit() {
  }

  updatePath() {

  }

  isCurrentPage(page: string): boolean {
    return this.activePage === page;
  }

  onMenuItemClick(item: any): void {
    this.activePage = item.label;
    if(item.route) {
      this.router.navigate([item.route]);
    }
  }

  onLogoutClick(): void {
    this.identityService.logout();
    this.router.navigate(['']);
  }
}
