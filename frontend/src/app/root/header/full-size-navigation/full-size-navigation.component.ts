import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MdbTooltipModule} from "mdb-angular-ui-kit/tooltip";
import {KeyValuePipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { Router, RouterLink} from "@angular/router";
import {IdentityService} from "../../../identity/identity.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Subscription} from "rxjs";
import {SearchDropdownComponent} from "../search-dropdown/search-dropdown.component";

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
    KeyValuePipe
  ],
  templateUrl: './full-size-navigation.component.html',
  styleUrl: './full-size-navigation.component.scss'
})
export class FullSizeNavigationComponent implements OnInit, OnDestroy {
  private searchResultSubscription: Subscription | undefined;

  @Input() locations!: any[];
  @Input() artists!: { [key: string]: any };
  @Input() broadGenres!: any;
  @Input() shoppingCartSize!: number;

  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('searchDropdown') searchDropdown!: ElementRef;


  constructor(private identityService: IdentityService,
              private router: Router,
              private snackBar: MatSnackBar) {}

  ngOnDestroy() {
    this.searchResultSubscription?.unsubscribe();
  }

  ngOnInit() {
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

  logout() {
    this.identityService.logout('');
  }

  getIdentityService() {
    return this.identityService;
  }
}
