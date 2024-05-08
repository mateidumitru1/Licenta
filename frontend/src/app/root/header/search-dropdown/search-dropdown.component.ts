import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {NavigationEnd, Router, RouterLink} from "@angular/router";
import {DropdownService} from "../dropdown.service";
import {HeaderService} from "../header.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-search-dropdown',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    RouterLink,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './search-dropdown.component.html',
  styleUrl: './search-dropdown.component.scss'
})
export class SearchDropdownComponent implements OnInit, OnDestroy {
  searchText: string = '';

  searchLocations: any[] = [];
  searchEvents: any[] = [];
  searchArtists: any[] = [];

  private searchResultSubscription: Subscription | undefined;

  showDropdown: boolean = false;

  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('searchDropdown') searchDropdown!: ElementRef;

  constructor(private dropdownService: DropdownService,
              private router: Router,
              private headerService: HeaderService) {}

  ngOnInit() {
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
    this.searchResultSubscription = this.dropdownService.showDropdown$.subscribe({
      next: (showDropdown: boolean) => {
        this.showDropdown = showDropdown;
      }
    });
  }

  ngOnDestroy() {
    this.searchResultSubscription?.unsubscribe();
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
}
