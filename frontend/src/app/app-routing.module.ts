import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./identity/login/login.component";
import {RegisterComponent} from "./identity/register/register.component";
import {ForgotPasswordComponent} from "./identity/forgot-password/forgot-password.component";
import {HomeComponent} from "./events/home/home.component";
import {LocationComponent} from "./events/location/location.component";
import {EventComponent} from "./events/event/event.component";
import {AdminDashboardComponent} from "./events/admin-dashboard/admin-dashboard.component";
import {PageNotFoundComponent} from "./shared/page-not-found/page-not-found.component";
import {AdminHomeComponent} from "./events/admin-dashboard/admin-home/admin-home.component";
import {AdminManageComponent} from "./events/admin-dashboard/admin-manage/admin-manage.component";
import {AdminStatisticsComponent} from "./events/admin-dashboard/admin-statistics/admin-statistics.component";
import {AdminGuard} from "./util/guards/admin.guard";
import {RootRedirectGuard} from "./util/guards/root-redirect-guard.service";
import {RootComponent} from "./events/root/root.component";
import {ResetPasswordComponent} from "./identity/reset-password/reset-password.component";
import {ShoppingCartComponent} from "./events/shopping-cart/shopping-cart.component";
import {ValidateComponent} from "./validate/validate.component";
import {AccountComponent} from "./account/account.component";
import {OrdersComponent} from "./account/orders/orders.component";
import {AccountGuard} from "./util/guards/account.guard";

const appRoutes: Routes = [
  { path: 'home' , redirectTo: '', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: 'validate-ticket/:ticketId', component: ValidateComponent },
  { path: 'page-not-found', component: PageNotFoundComponent },
  { path: 'account', canActivate: [AccountGuard], component: AccountComponent, children: [
    { path: 'orders', component: OrdersComponent },
    ]},
  { path: 'admin-dashboard', canActivate: [AdminGuard], component: AdminDashboardComponent, children: [
    { path: '', pathMatch: 'full', component: AdminHomeComponent },
    { path: 'manage', component: AdminManageComponent },
    { path: 'statistics', component: AdminStatisticsComponent }
    ]},
  { path: '', canActivate: [RootRedirectGuard], component: RootComponent, children: [
      { path: '', pathMatch: 'full', component: HomeComponent },
      { path: 'shopping-cart', component: ShoppingCartComponent },
      { path: ':location' , component: LocationComponent },
      { path: ':location/:eventName/:eventId', component: EventComponent },
  ]},
  { path: '**', redirectTo: 'page-not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {

}
