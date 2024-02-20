import { Routes } from '@angular/router';
import {RootComponent} from "./root/root.component";
import {HomeComponent} from "./root/home/home.component";
import {LocationComponent} from "./root/location/location.component";
import {EventComponent} from "./root/event/event.component";
import {LoginComponent} from "./identity/login/login.component";
import {RegisterComponent} from "./identity/register/register.component";
import {ForgotPasswordComponent} from "./identity/forgot-password/forgot-password.component";
import {ShoppingCartComponent} from "./root/shopping-cart/shopping-cart.component";
import {AccountComponent} from "./account/account.component";
import {AdminDashboardComponent} from "./admin-dashboard/admin-dashboard.component";
import {AdminGuard} from "./util/guards/admin.guard";
import {RootGuard} from "./util/guards/root.guard";
import {HomeAdminComponent} from "./admin-dashboard/home-admin/home-admin.component";
import {StatisticsComponent} from "./admin-dashboard/statistics/statistics.component";
import {SettingsComponent} from "./admin-dashboard/settings/settings.component";
import {ManageUsersComponent} from "./admin-dashboard/manage/manage-users/manage-users.component";
import {ManageLocationsComponent} from "./admin-dashboard/manage/manage-locations/manage-locations.component";
import {ManageEventsComponent} from "./admin-dashboard/manage/manage-events/manage-events.component";
import {ManageOrdersComponent} from "./admin-dashboard/manage/manage-orders/manage-orders.component";
import {PageNotFoundComponent} from "./root/page-not-found/page-not-found.component";
import {AccountGuard} from "./util/guards/account.guard";
import {AccountOrdersComponent} from "./account/account-orders/account-orders.component";
import {AccountSettingsComponent} from "./account/account-settings/account-settings.component";
import {ResetPasswordComponent} from "./identity/reset-password/reset-password.component";
import {
  AccountOrderDetailsComponent
} from "./account/account-orders/account-order-details/account-order-details.component";
import {AccountDetailsComponent} from "./account/account-details/account-details.component";
import {TrackEventComponent} from "./root/track-event/track-event.component";
import {TrackEventDetailsComponent} from "./root/track-event/track-event-details/track-event-details.component";

export const routes: Routes = [
  { path: 'home' , redirectTo: '', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: 'account', canActivate: [AccountGuard], component: AccountComponent, children: [
      { path: '', pathMatch: 'full', component: AccountDetailsComponent },
      { path: 'orders', component: AccountOrdersComponent },
      { path: 'orders/:orderNumber', component: AccountOrderDetailsComponent },
      { path: 'settings', component: AccountSettingsComponent }
    ]},
  { path: 'admin-dashboard', canActivate: [AdminGuard], component: AdminDashboardComponent, children: [
      { path: '', pathMatch: 'full', component: HomeAdminComponent},
      { path: 'home', redirectTo: '' },
      { path: 'manage/users', component: ManageUsersComponent },
      { path: 'manage/locations', component: ManageLocationsComponent },
      { path: 'manage/events', component: ManageEventsComponent },
      { path: 'manage/orders', component: ManageOrdersComponent },
      { path: 'statistics', component: StatisticsComponent },
      { path: 'settings', component: SettingsComponent },
    ]},
  { path: '', canActivate: [RootGuard], component: RootComponent, children: [
      { path: '', pathMatch: 'full', component: HomeComponent },
      { path: 'track', component: TrackEventComponent },
      { path: 'track/:event', component: TrackEventDetailsComponent },
      { path: 'shopping-cart', component: ShoppingCartComponent },
      { path: ':location' , component: LocationComponent },
      { path: ':location/:event', component: EventComponent },
      { path: 'page-not-found', component: PageNotFoundComponent }
    ]},
];