import {Component, Input, OnInit} from '@angular/core';
import {KeyValuePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {SearchDropdownComponent} from "../search-dropdown/search-dropdown.component";
import {IdentityService} from "../../../identity/identity.service";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {MdbTooltipModule} from "mdb-angular-ui-kit/tooltip";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-mobile-size-navigation',
  standalone: true,
    imports: [
        NgForOf,
        NgIf,
        RouterLink,
        SearchDropdownComponent,
        NgClass,
        KeyValuePipe,
        MdbTooltipModule
    ],
  templateUrl: './mobile-size-navigation.component.html',
  styleUrl: './mobile-size-navigation.component.scss',
  animations: [
    trigger('slide', [
      state('in', style({
        visibility: 'visible',
        transform: 'translate3d(0, 0, 0)'
      })),
      state('out', style({
        visibility: 'hidden',
        transform: 'translate3d(100%, 0, 0)'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ])
  ]
})
export class MobileSizeNavigationComponent implements OnInit {
  panelDisplay: boolean = false;
  shouldDisplayLocations: boolean = false;
  shouldDisplayArtists: boolean = false;
  shouldDisplayGenres: boolean = false;

  @Input() shoppingCartSize!: number;
  @Input() locations!: any[];
  @Input() artists!: any[];
  @Input() broadGenres!: any[];

  constructor(private identityService: IdentityService,
              private router: Router,
              private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      this.panelDisplay = false;
      this.shouldDisplayLocations = false;
      this.shouldDisplayArtists = false;
      this.shouldDisplayGenres = false;
      document.body.style.overflow = 'auto';
    });
  }

  logout() {
    this.identityService.logout('');
  }

  getIdentityService() {
    return this.identityService;
  }

  togglePanel() {
    this.panelDisplay = !this.panelDisplay;
    document.body.style.overflow = this.panelDisplay ? 'hidden' : 'auto';
    if (!this.panelDisplay) {
      window.removeEventListener('resize', this.handleResize);
    } else {
      window.addEventListener('resize', this.handleResize);
    }
  }
  handleResize() {
    if (window.innerWidth > 768) {
      document.body.style.overflow = 'auto';
    }
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
