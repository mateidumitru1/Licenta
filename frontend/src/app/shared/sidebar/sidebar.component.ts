import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MdbCollapseDirective, MdbCollapseModule} from "mdb-angular-ui-kit/collapse";
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
    '/account': 'Contul meu',
    '/account/orders/:id': 'Comenzi',
    '/account/track': 'Urmareste evenimente',
    '/account/settings': 'Setari',
  }

  constructor(private router: Router, private route: ActivatedRoute, private identityService: IdentityService) {}

  ngOnInit() {
    const url = this.router.url;
    this.updateActivePage(url)

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const url = this.router.url;

      this.updateActivePage(url);
    });
  }

  updateActivePage(url: string) {
    this.activePage = '';
    for (let i = this.menuItems.length - 1; i > 0; i--) {
      if (this.menuItems[i].hasOwnProperty('route') && url.includes(this.menuItems[i].route)) {
        this.activePage = this.menuItems[i].label;
        return;
      }
    }
    if (url === this.menuItems[0].route) {
      this.activePage = this.menuItems[0].label;
      return;
    }
    if (this.activePage === '') {
      let submenuItem: any[] = [];
      for (let i = this.menuItems.length - 1; i > 0; i--) {
        if (this.menuItems[i].hasOwnProperty('submenu')) {
          submenuItem = this.menuItems[i].submenu;
        }
      }
      if (submenuItem.length > 0) {
        for (let i = submenuItem.length - 1; i >= 0; i--) {
          if (url.includes(submenuItem[i].route)) {
            this.activePage = submenuItem[i].label;
            return;
          }
        }
    }
  }
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

@ViewChild('sidebarMenu') sidebarMenu!: MdbCollapseDirective;

toggleSidebarMenu() {
  this.sidebarMenu.toggle();
}
}
