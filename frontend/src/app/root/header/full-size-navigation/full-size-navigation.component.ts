import {AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MdbTooltipModule} from "mdb-angular-ui-kit/tooltip";
import {KeyValuePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { Router, RouterLink} from "@angular/router";
import {IdentityService} from "../../../identity/identity.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Subscription} from "rxjs";
import {SearchDropdownComponent} from "../search-dropdown/search-dropdown.component";
import {animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-full-size-navigation',
  standalone: true,
  imports: [
    MdbTooltipModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    FormsModule,
    SearchDropdownComponent,
    KeyValuePipe,
    NgClass
  ],
  templateUrl: './full-size-navigation.component.html',
  styleUrl: './full-size-navigation.component.scss',
  animations: [
    trigger('dropdown', [
      state('true', style({
        visibility: 'visible',
        opacity: 1,
      })),
      state('false', style({
        visibility: 'hidden',
        opacity: 0,
      })),
      transition('true <=> false', animate('200ms ease-in-out'))
    ]),
    trigger('sliderAnimation', [
      state('void', style({
        width: '0',
        transform: 'translateX(0)'
      })),
      state('*', style({
        width: '{{ width }}px',
        transform: 'translateX({{ offset }}px)'
      }), { params: { width: 0, offset: 0 } }),
      transition('void <=> *', animate('0.3s ease-in-out'))
    ])
  ]
})
export class FullSizeNavigationComponent implements OnInit, OnDestroy {
  private searchResultSubscription: Subscription | undefined;

  @Input() locations!: any[];
  @Input() artists!: { [key: string]: any };
  @Input() broadGenres!: any;
  @Input() shoppingCartSize!: number;

  locationsDropdownIsVisible: boolean = false;
  artistsDropdownIsVisible: boolean = false;
  genresDropdownIsVisible: boolean = false;
  accountDropdownIsVisible: boolean = false;


  constructor(private identityService: IdentityService,
              private router: Router,
              private snackBar: MatSnackBar) {}

  ngOnDestroy() {
    this.searchResultSubscription?.unsubscribe();
  }

  ngOnInit() {
    this.router.events.subscribe(() => {
      this.locationsDropdownIsVisible = false;
      this.artistsDropdownIsVisible = false;
      this.genresDropdownIsVisible = false;
      this.accountDropdownIsVisible = false;
    });
  }

  onShoppingCartClick() {
    if (this.identityService.isLoggedIn()) {
      this.router.navigate(['/account/shopping-cart']);
    } else {
      this.snackBar.open('Trebuie sa fii autentificat pentru a vedea cosul de cumparaturi!', 'Close', {
        duration: 3000,
      });
    }
  }

  logout() {
    this.identityService.logout('');
  }

  getIdentityService() {
    return this.identityService;
  }

  toggleLocationsDropdown() {
    this.locationsDropdownIsVisible = !this.locationsDropdownIsVisible;
    this.artistsDropdownIsVisible = false;
    this.genresDropdownIsVisible = false;
    this.accountDropdownIsVisible = false;
  }

  toggleArtistsDropdown() {
    this.artistsDropdownIsVisible = !this.artistsDropdownIsVisible;
    this.locationsDropdownIsVisible = false;
    this.genresDropdownIsVisible = false;
    this.accountDropdownIsVisible = false;
  }

  toggleGenresDropdown() {
    this.genresDropdownIsVisible = !this.genresDropdownIsVisible;
    this.locationsDropdownIsVisible = false;
    this.artistsDropdownIsVisible = false;
    this.accountDropdownIsVisible = false;
  }

  toggleAccountDropdown() {
    this.accountDropdownIsVisible = !this.accountDropdownIsVisible;
    this.locationsDropdownIsVisible = false;
    this.artistsDropdownIsVisible = false;
    this.genresDropdownIsVisible = false;
  }
}
