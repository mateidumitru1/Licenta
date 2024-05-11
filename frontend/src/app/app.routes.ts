import { Routes } from '@angular/router';
import {RootComponent} from "./root/root.component";
import {HomeComponent} from "./root/home/home.component";
import {LocationComponent} from "./root/location/location.component";
import {EventComponent} from "./root/event-list/event/event.component";
import {LoginComponent} from "./identity/login/login.component";
import {RegisterComponent} from "./identity/register/register.component";
import {ForgotPasswordComponent} from "./identity/forgot-password/forgot-password.component";
import {ShoppingCartComponent} from "./root/shopping-cart/shopping-cart.component";
import {AccountComponent} from "./account/account.component";
import {AdminDashboardComponent} from "./admin-dashboard/admin-dashboard.component";
import {AdminGuard} from "./util/guards/can-activate/admin.guard";
import {RootGuard} from "./util/guards/can-activate/root.guard";
import {HomeAdminComponent} from "./admin-dashboard/home-admin/home-admin.component";
import {StatisticsComponent} from "./admin-dashboard/statistics/statistics.component";
import {ManageUsersComponent} from "./admin-dashboard/manage/manage-users/manage-users.component";
import {ManageLocationsComponent} from "./admin-dashboard/manage/manage-locations/manage-locations.component";
import {ManageEventsComponent} from "./admin-dashboard/manage/manage-events/manage-events.component";
import {ManageOrdersComponent} from "./admin-dashboard/manage/manage-orders/manage-orders.component";
import {PageNotFoundComponent} from "./root/page-not-found/page-not-found.component";
import {AccountGuard} from "./util/guards/can-activate/account.guard";
import {AccountOrdersComponent} from "./account/account-orders/account-orders.component";
import {AccountSettingsComponent} from "./shared/account-settings/account-settings.component";
import {ResetPasswordComponent} from "./identity/reset-password/reset-password.component";
import {
  AccountOrderDetailsComponent
} from "./account/account-orders/account-order-details/account-order-details.component";
import {AccountDetailsComponent} from "./account/account-details/account-details.component";
import {TrackEventComponent} from "./root/track-event/track-event.component";
import {TrackEventDetailsComponent} from "./root/track-event/track-event-details/track-event-details.component";
import {ValidatorDashboardComponent} from "./validator-dashboard/validator-dashboard.component";
import {HomeValidatorComponent} from "./validator-dashboard/home-validator/home-validator.component";
import {ValidatorGuard} from "./util/guards/can-activate/validator.guard";
import {ScannerComponent} from "./validator-dashboard/scanner/scanner.component";
import {VerifyAccountComponent} from "./identity/verify-account/verify-account.component";
import {
  ResendVerifyAccountEmailComponent
} from "./identity/resend-verify-account-email/resend-verify-account-email.component";
import {IdentityGuard} from "./util/guards/can-activate/identity.guard";
import {ArtistsListComponent} from "./root/artists-list/artists-list.component";
import {ArtistComponent} from "./root/artists-list/artist/artist.component";
import {ManageArtistsComponent} from "./admin-dashboard/manage/manage-artists/manage-artists.component";
import {EventListComponent} from "./root/event-list/event-list.component";
import {GenreListComponent} from "./root/genre-list/genre-list.component";

export const routes: Routes = [
  { path: 'home' , redirectTo: '', pathMatch: 'full' },
  { path: 'login', canActivate: [IdentityGuard], component: LoginComponent },
  { path: 'register', canActivate: [IdentityGuard], component: RegisterComponent },
  { path: 'forgot-password', canActivate: [IdentityGuard], component: ForgotPasswordComponent },
  { path: 'reset-password/:token', canActivate: [IdentityGuard], component: ResetPasswordComponent },
  { path: 'account', canActivate: [AccountGuard], component: AccountComponent, children: [
      { path: '', pathMatch: 'full', component: AccountDetailsComponent },
      { path: 'orders', component: AccountOrdersComponent },
      { path: 'orders/:orderNumber', component: AccountOrderDetailsComponent },
      { path: 'track', component: TrackEventComponent },
      { path: 'event-details/:event', component: TrackEventDetailsComponent },
      { path: 'settings', component: AccountSettingsComponent }
    ]},
  { path: 'admin-dashboard', canActivate: [AdminGuard], component: AdminDashboardComponent, children: [
      { path: '', pathMatch: 'full', component: HomeAdminComponent},
      { path: 'home', redirectTo: '' },
      { path: 'manage/users', component: ManageUsersComponent },
      { path: 'manage/locations', component: ManageLocationsComponent },
      { path: 'manage/events', component: ManageEventsComponent },
      { path: 'manage/artists', component: ManageArtistsComponent },
      { path: 'manage/orders', component: ManageOrdersComponent },
      { path: 'statistics', component: StatisticsComponent },
      { path: 'settings', component: AccountSettingsComponent },
    ]},
  { path: 'validator-dashboard', canActivate: [ValidatorGuard], component: ValidatorDashboardComponent, children: [
      { path: '', pathMatch: 'full', component: HomeValidatorComponent},
      { path: 'scanner', component: ScannerComponent },
      { path: 'settings', component: AccountSettingsComponent },
    ]},
  { path: '', canActivate: [RootGuard], component: RootComponent, children: [
      { path: '', pathMatch: 'full', component: HomeComponent },
      { path: 'page-not-found', component: PageNotFoundComponent },
      { path: 'shopping-cart', canActivate: [AccountGuard], component: ShoppingCartComponent },
      { path: 'verify-account/:token', canActivate: [IdentityGuard], component: VerifyAccountComponent },
      { path: 'resend-verify-account-email/:email', canActivate: [IdentityGuard], component: ResendVerifyAccountEmailComponent },
      { path: 'events', component: EventListComponent},
      { path: 'genres', component: GenreListComponent},
      { path: 'artists', redirectTo: 'artists/A', pathMatch: 'full' },
      { path: 'artists/:letter', component: ArtistsListComponent },
      { path: 'artist/:artist', component: ArtistComponent },
      { path: 'location/:location' , pathMatch: 'full', component: LocationComponent },
      { path: 'event/:event', pathMatch: 'full', component: EventComponent },
    ]},
];
