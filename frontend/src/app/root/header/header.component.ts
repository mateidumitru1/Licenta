import {Component, OnInit} from '@angular/core';
import {MdbDropdownModule} from "mdb-angular-ui-kit/dropdown";
import {NgForOf, NgIf} from "@angular/common";
import {MdbCollapseModule} from "mdb-angular-ui-kit/collapse";
import {HeaderService} from "./header.service";
import {NavigationExtras, Router, RouterLink} from "@angular/router";
import {IdentityService} from "../../identity/identity.service";
import {JwtHandler} from "../../identity/jwt.handler";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LoadingComponent} from "../../shared/loading/loading.component";
import {apiURL} from "../../app.config";

@Component({
  selector: 'app-header',
  standalone: true,
    imports: [
        MdbDropdownModule,
        NgIf,
        MdbCollapseModule,
        NgForOf,
        RouterLink,
        LoadingComponent
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

  constructor(private router: Router, private headerService: HeaderService, private identityService: IdentityService,
              private jwtHandler:JwtHandler, private snackBar: MatSnackBar) {}
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
      }
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
    if(this.jwtHandler.isLoggedIn()) {
      this.router.navigate(['/shopping-cart']);
    }
    else {
      this.snackBar.open('You need to be logged in to access the shopping cart!', 'Close', {
        duration: 3000
      });
    }
  }

  protected readonly apiURL = apiURL;
}
