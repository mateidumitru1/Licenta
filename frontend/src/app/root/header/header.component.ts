import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {HeaderService} from "./header.service";
import {NavigationEnd, Router, RouterLink} from "@angular/router";
import {IdentityService} from "../../identity/identity.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LoadingComponent} from "../../shared/loading/loading.component";
import {FormsModule} from "@angular/forms";
import {DropdownService} from "./dropdown.service";
import {ShoppingCartService} from "../shopping-cart/shopping-cart.service";
import {Subscription} from "rxjs";
import {MdbTooltipModule} from "mdb-angular-ui-kit/tooltip";
import {MdbCollapseModule} from "mdb-angular-ui-kit/collapse";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    RouterLink,
    LoadingComponent,
    FormsModule,
    MdbTooltipModule,
    MdbCollapseModule,
    NgClass
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private shoppingCartSubscription: Subscription | undefined;
  private locationsSubscription: Subscription | undefined;
  private dropDownSubscription: Subscription | undefined;
  private searchResultSubscription: Subscription | undefined;

  locations: any[] = [];

  showDropdown: boolean = false;
  searchText: string = '';
  searchLocations: any[] = [];
  searchEvents: any[] = [];
  searchArtists: any[] = [];

  shoppingCartSize!: number;

  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('searchDropdown') searchDropdown!: ElementRef;

  constructor(
    private router: Router,
    private headerService: HeaderService,
    private identityService: IdentityService,
    private shoppingCartService: ShoppingCartService,
    private snackBar: MatSnackBar,
    private dropdownService: DropdownService
  ) {}

  async ngOnInit() {
    this.dropdownService.setShowDropdown(false);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.searchText = '';
        this.searchLocations = [];
        this.searchEvents = [];
        this.searchArtists = [];
        this.dropdownService.setShowDropdown(false);
        this.panelDisplay = false;
        this.shouldDisplayLocations = false;
        this.shouldDisplayArtists = false;
        this.shouldDisplayGenres = false;
      }
    });
    this.dropDownSubscription = this.dropdownService.showDropdown$.subscribe((showDropdown) => {
      this.showDropdown = showDropdown;
    });

    await this.headerService.fetchHeaderData();
    this.headerService.getLocations().subscribe({
      next: (locations: any) => {
        this.locations = locations;
      }
    });
    this.shoppingCartSubscription = this.headerService.getShoppingCartSize().subscribe({
      next: (shoppingCartSize: number) => {
        this.shoppingCartSize = shoppingCartSize;
      }
    });
  }

  ngOnDestroy() {
    this.shoppingCartSubscription?.unsubscribe();
    this.locationsSubscription?.unsubscribe();
    this.dropDownSubscription?.unsubscribe();
    this.searchResultSubscription?.unsubscribe();
  }

  onShoppingCartClick() {
    if (this.identityService.isLoggedIn()) {
      this.router.navigate(['/shopping-cart']);
    } else {
      this.snackBar.open('Trebuie sa fii autentificat pentru a vedea cosul de cumparaturi!', 'Close', {
        duration: 3000,
      });
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const isSearchDropdownClicked = this.searchDropdown &&
      this.searchDropdown.nativeElement &&
      this.searchDropdown.nativeElement.contains(event.target);

    const isSearchInputClicked = this.searchInput &&
      this.searchInput.nativeElement &&
      this.searchInput.nativeElement.contains(event.target);

    if (!isSearchDropdownClicked && !isSearchInputClicked) {
      this.dropdownService.setShowDropdown(false);
    } else if (isSearchInputClicked && (this.searchLocations.length > 0 || this.searchEvents.length > 0 || this.searchArtists.length > 0)) {
      this.dropdownService.setShowDropdown(true);
    }
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.searchInput.nativeElement.contains(document.activeElement)) {
      this.search();
    }
  }

  async search() {
    if(this.searchText === '') {
      return;
    }
    await this.headerService.search(this.searchText)
    this.searchResultSubscription = this.headerService.getSearchResults().subscribe({
      next: (searchResults: any) => {
        this.searchLocations = searchResults.locationList;
        this.searchEvents = searchResults.eventList;
        this.searchArtists = searchResults.artistList;
      }
    });
    this.dropdownService.setShowDropdown(true);
  }

  logout() {
    this.identityService.logout();
  }

  getIdentityService() {
    return this.identityService;
  }

  panelDisplay: boolean = false;
  shouldDisplayLocations: boolean = false;
  shouldDisplayArtists: boolean = false;
  shouldDisplayGenres: boolean = false;

  togglePanel() {
    this.panelDisplay = !this.panelDisplay;
  }

  toggleContentDisplay(content: string) {
    switch (content) {
      case 'locations':
        this.shouldDisplayLocations = !this.shouldDisplayLocations;
        this.shouldDisplayArtists = false;
        this.shouldDisplayGenres = false;
        break;
      case 'artists':
        this.shouldDisplayArtists = !this.shouldDisplayArtists;
        this.shouldDisplayLocations = false;
        this.shouldDisplayGenres = false;
        break;
      case 'genres':
        this.shouldDisplayGenres = !this.shouldDisplayGenres;
        this.shouldDisplayLocations = false;
        this.shouldDisplayArtists = false;
        break;
    }
  }
}
