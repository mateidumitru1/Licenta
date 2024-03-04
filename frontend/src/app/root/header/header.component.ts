import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {MdbDropdownModule} from "mdb-angular-ui-kit/dropdown";
import {NgForOf, NgIf} from "@angular/common";
import {MdbCollapseModule} from "mdb-angular-ui-kit/collapse";
import {HeaderService} from "./header.service";
import {Router, RouterLink} from "@angular/router";
import {IdentityService} from "../../identity/identity.service";
import {JwtHandler} from "../../identity/jwt.handler";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LoadingComponent} from "../../shared/loading/loading.component";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MdbDropdownModule,
    NgIf,
    MdbCollapseModule,
    NgForOf,
    RouterLink,
    LoadingComponent,
    FormsModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit{
  loading: boolean = true;
  locations: any[] = [];
  locationsToDisplay: any[] = [];
  startIndex: number = 0;
  animateScroll: boolean = false;

  showDropdown: boolean = false;
  searchText: string = '';
  searchLocations: any[] = [];
  searchEvents: any[] = [];

  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('searchDropdown') searchDropdown!: ElementRef;

  constructor(
    private router: Router,
    private headerService: HeaderService,
    private identityService: IdentityService,
    private jwtHandler: JwtHandler,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.headerService.fetchLocations().subscribe({
      next: (locations: any) => {
        this.locations = locations;
        this.locationsToDisplay = this.locations.slice(this.startIndex, this.startIndex + 5);
      },
      error: (error: any) => {
        console.error('Error fetching locations', error);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  scrollToNext() {
    this.animateScroll = true;
    this.startIndex += 5;
    if (this.startIndex >= this.locations.length) {
      this.startIndex = 0;
      this.locationsToDisplay = this.locations.slice(this.startIndex, this.startIndex + 5);
    } else if (this.locations.length - this.startIndex < 5) {
      this.locationsToDisplay = this.locations.slice(this.startIndex, this.locations.length);
    } else {
      this.locationsToDisplay = this.locations.slice(this.startIndex, this.startIndex + 5);
    }
  }

  logout() {
    this.identityService.logout();
  }

  getIdentityService() {
    return this.identityService;
  }

  onShoppingCartClick() {
    if (this.jwtHandler.isLoggedIn()) {
      this.router.navigate(['/shopping-cart']);
    } else {
      this.snackBar.open('You need to be logged in to access the shopping cart!', 'Close', {
        duration: 3000,
      });
    }
  }

  onSearchTextChange($event: any) {
    if (this.searchText.length > 2) {
      this.filterLocations();
      this.filterEvents();
      this.showDropdown = true;
    } else {
      this.searchLocations = [];
      this.searchEvents = [];
    }
  }

  filterLocations() {
    const filteredLocations = this.locations.filter((location: any) => {
      return location.name.toLowerCase().includes(this.searchText.toLowerCase());
    });
    if (filteredLocations.length > 0) {
      this.searchLocations = filteredLocations.slice(0, 5);
    }
  }
  filterEvents() {
    const filteredEvents: any[] = [];
    this.locations.forEach((location: any) => {
      location.eventList.filter((event: any) => {
        if (event.title.toLowerCase().includes(this.searchText.toLowerCase())) {
          event['locationName'] = location.name;
          filteredEvents.push(event);
        }
      });
    });
    if (filteredEvents.length > 0) {
      this.searchEvents = filteredEvents.slice(0, 5);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (
      this.searchDropdown &&
      this.searchDropdown.nativeElement &&
      !this.searchDropdown.nativeElement.contains(event.target) &&
      this.searchInput &&
      this.searchInput.nativeElement &&
      !this.searchInput.nativeElement.contains(event.target)
    ) {
      this.showDropdown = false;
    }
    else {
      this.showDropdown = true;
    }
  }
  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    this.showDropdown = event.key === 'Enter' && this.searchInput.nativeElement === document.activeElement;
  }
}
