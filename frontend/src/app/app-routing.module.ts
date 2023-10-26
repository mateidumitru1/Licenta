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

const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'home', pathMatch: 'full', component: HomeComponent },
  { path: 'page-not-found', component: PageNotFoundComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent, children: [
    { path: '', pathMatch: 'full', component: AdminHomeComponent },
    { path: 'manage', component: AdminManageComponent },
    { path: 'statistics', component: AdminStatisticsComponent }
    ]},
  { path: ':location' , component: LocationComponent },
  { path: ':location/:eventName/:eventId', component: EventComponent },
  { path: '**', redirectTo: 'page-not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {

}
