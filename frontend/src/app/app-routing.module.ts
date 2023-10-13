import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {ForgotPasswordComponent} from "./forgot-password/forgot-password.component";
import {HomeComponent} from "./home/home.component";
import {PlaceEventsComponent} from "./place-events/place-events.component";
import {EventComponent} from "./place-events/event/event.component";

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'home', pathMatch: 'full', component: HomeComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: ':place' , component: PlaceEventsComponent },
  { path: 'place/:event', component: EventComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {

}
