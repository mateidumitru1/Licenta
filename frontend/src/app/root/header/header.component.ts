import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {MdbDropdownModule} from "mdb-angular-ui-kit/dropdown";
import {NgForOf, NgIf} from "@angular/common";
import {MdbCollapseModule} from "mdb-angular-ui-kit/collapse";
import {HeaderService} from "./header.service";
import {NavigationEnd, Router, RouterLink} from "@angular/router";
import {IdentityService} from "../../identity/identity.service";
import {JwtHandler} from "../../identity/jwt.handler";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LoadingComponent} from "../../shared/loading/loading.component";
import {FormsModule} from "@angular/forms";
import {DropdownService} from "./dropdown.service";

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
export class HeaderComponent implements OnInit {
  locations: any[] = [];
  locationsToDisplay: any[] = [];
  startIndex: number = 0;

  showDropdown: boolean = false;
  searchText: string = '';
  searchLocations: any[] = [];
  searchEvents: any[] = [];
  searchArtists: any[] = [];

  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('searchDropdown') searchDropdown!: ElementRef;

  constructor(
    private router: Router,
    private headerService: HeaderService,
    private identityService: IdentityService,
    private jwtHandler: JwtHandler,
    private snackBar: MatSnackBar,
    private dropdownService: DropdownService
  ) {}

  ngOnInit(): void {
    this.dropdownService.setShowDropdown(false);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.searchText = '';
        this.searchLocations = [];
        this.searchEvents = [];
        this.searchArtists = [];
        this.dropdownService.setShowDropdown(false);
      }
    });
    this.dropdownService.showDropdown$.subscribe((showDropdown) => {
      this.showDropdown = showDropdown;
      console.log('showDropdown', showDropdown);
    });
    this.headerService.fetchLocations().subscribe({
      next: (locations: any) => {
        this.locations = locations;
        this.locationsToDisplay = this.locations.slice(0, 5);
      },
      error: (error: any) => {
        console.error('Error fetching locations with available events', error);
      }
    });
  }

  scrollToNext() {
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
      this.dropdownService.setShowDropdown(false);
    }
    else if (this.searchLocations.length !== 0 || this.searchEvents.length !== 0 || this.searchArtists.length !== 0) {
      this.dropdownService.setShowDropdown(true);
    }
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.searchInput.nativeElement.contains(document.activeElement)) {
      this.search();
    }
  }

  search() {
    if(this.searchText === '') {
      return;
    }
    this.headerService.search(this.searchText).subscribe({
      next: (response: any) => {
        this.searchLocations = response.locationList;
        this.searchEvents = response.eventList;
        this.searchArtists = response.artistList;
        this.dropdownService.setShowDropdown(true);
      },
      error: (error: any) => {
        console.error('Error searching', error);
      }
    });
  }

  getDropdownService() {
    return this.dropdownService;
  }
}
