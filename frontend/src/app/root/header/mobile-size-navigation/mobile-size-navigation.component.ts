import {Component, Input, OnInit} from '@angular/core';
import {KeyValuePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {SearchDropdownComponent} from "../search-dropdown/search-dropdown.component";
import {IdentityService} from "../../../identity/identity.service";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-mobile-size-navigation',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    RouterLink,
    SearchDropdownComponent,
    NgClass,
    KeyValuePipe
  ],
  templateUrl: './mobile-size-navigation.component.html',
  styleUrl: './mobile-size-navigation.component.scss',
  animations: [
    trigger('slide', [
      state('in', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      state('out', style({
        transform: 'translate3d(100%, 0, 0)'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ])
  ]
})
export class MobileSizeNavigationComponent implements OnInit {
  @Input() shoppingCartSize!: number;
  @Input() locations!: any[];
  @Input() artists!: any[];
  @Input() broadGenres!: any[];

  panelDisplay: boolean = false;
  shouldDisplayLocations: boolean = false;
  shouldDisplayArtists: boolean = false;
  shouldDisplayGenres: boolean = false;

  constructor(private identityService: IdentityService,
              private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      this.panelDisplay = false;
      this.shouldDisplayLocations = false;
      this.shouldDisplayArtists = false;
      this.shouldDisplayGenres = false;
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
