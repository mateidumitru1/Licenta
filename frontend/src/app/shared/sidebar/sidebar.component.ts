import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MdbCollapseModule} from "mdb-angular-ui-kit/collapse";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, NavigationEnd, Router, RouterLink} from "@angular/router";
import {IdentityService} from "../../identity/identity.service";
import {filter} from "rxjs";

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
  activePage: string = '';

  page: string = '';
  pageNameMap: {
    [key: string]: string
  } = {
    '/admin-dashboard': 'Acasa',
    '/admin-dashboard/manage/users': 'Gestioneaza Utilizatori',
    '/admin-dashboard/manage/locations': 'Gestioneaza Locatii',
    '/admin-dashboard/manage/events': 'Gestioneaza Evenimente',
    '/admin-dashboard/manage/artists': 'Gestioneaza Artisti',
    '/admin-dashboard/manage/orders': 'Gestioneaza Comenzi',
    '/admin-dashboard/statistics': 'Statistici',
    '/admin-dashboard/settings': 'Setari',
  }

  @ViewChild('submenu') submenu!: ElementRef;

  constructor(private router: Router, private route: ActivatedRoute, private identityService: IdentityService) {}

  ngOnInit() {
    this.page = this.router.url.split('/').join('/').split('?')[0];
    if (this.page.includes('manage')) {
      this.activePage = this.pageNameMap[this.page].split(' ')[1];
    }
    else {
      this.activePage = this.pageNameMap[this.page];
    }
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const url = this.router.url;

      this.page = url.split('/').join('/').split('?')[0];
      if (this.page.includes('manage')) {
        this.activePage = this.pageNameMap[this.page].split(' ')[1];
      }
      else {
        this.activePage = this.pageNameMap[this.page];
      }
    });
  }

  isCurrentPage(page: string): boolean {
    return this.activePage === page;
  }

  onMenuItemClick(item: any): void {
    if(item.route) {
      if(item.route.includes('manage')) {
        this.router.navigate([item.route], { queryParams: { page: 0, size: 5 } });
      }
      else {
        this.router.navigate([item.route]);
      }
    }
  }

  onLogoutClick() {
    this.identityService.logout('go home');
  }
}
