import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./identity/login/login.component";
import {RegisterComponent} from "./identity/register/register.component";
import {ForgotPasswordComponent} from "./identity/forgot-password/forgot-password.component";
import {HomeComponent} from "./events/home/home.component";
import {PlaceEventsComponent} from "./events/place-events/place-events.component";
import {EventComponent} from "./events/event/event.component";

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'home', pathMatch: 'full', component: HomeComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: ':place' , component: PlaceEventsComponent },
  { path: ':place/:event', component: EventComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {

}
