import { NgModule } from '@angular/core';
import {BrowserModule, DomSanitizer} from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './identity/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import { RegisterComponent } from './identity/register/register.component';
import { ForgotPasswordComponent } from './identity/forgot-password/forgot-password.component';
import {MatIconModule, MatIconRegistry} from "@angular/material/icon";
import {AppRoutingModule} from "./app-routing.module";
import {HttpClientModule} from "@angular/common/http";
import { FillFieldsWarningComponent } from './shared/fill-fields-warning/fill-fields-warning.component';
import { HomeComponent } from './events/home/home.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatMenuModule} from "@angular/material/menu";
import { NavbarComponent } from './shared/navbar/navbar.component';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatListModule} from "@angular/material/list";
import {MatCardModule} from "@angular/material/card";
import { PlaceEventsComponent } from './events/place-events/place-events.component';
import {EventComponent} from "./events/event/event.component";
import {NgOptimizedImage} from "@angular/common";
import { AccountMenuComponent } from './shared/navbar/account-menu/account-menu.component';
import { PlacesMenuComponent } from './shared/navbar/places-menu/places-menu.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    FillFieldsWarningComponent,
    EventComponent,
    HomeComponent,
    NavbarComponent,
    PlaceEventsComponent,
    AccountMenuComponent,
    PlacesMenuComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatGridListModule,
    MatListModule,
    MatCardModule,
    NgOptimizedImage
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    matIconRegistry.addSvgIconSet(
      domSanitizer.bypassSecurityTrustResourceUrl('./assets/mdi.svg')
    );
  }
}
