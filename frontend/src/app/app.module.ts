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
import { LocationComponent } from './events/location/location.component';
import {EventComponent} from "./events/event/event.component";
import {NgOptimizedImage} from "@angular/common";
import { AccountMenuComponent } from './shared/navbar/account-menu/account-menu.component';
import { LocationsMenuComponent } from './shared/navbar/locations-menu/locations-menu.component';
import { TicketsComponent } from './shared/tickets/tickets.component';
import { AdminDashboardComponent } from './events/admin-dashboard/admin-dashboard.component';
import {MatTabsModule} from "@angular/material/tabs";
import {MatSidenavModule} from "@angular/material/sidenav";
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { AdminHomeComponent } from './events/admin-dashboard/admin-home/admin-home.component';
import { AdminManageComponent } from './events/admin-dashboard/admin-manage/admin-manage.component';
import { AdminStatisticsComponent } from './events/admin-dashboard/admin-statistics/admin-statistics.component';
import {MatTableModule} from "@angular/material/table";
import { AdminManageUsersComponent } from './events/admin-dashboard/admin-manage/admin-manage-users/admin-manage-users.component';
import { AdminManageLocationsComponent } from './events/admin-dashboard/admin-manage/admin-manage-locations/admin-manage-locations.component';
import { AdminManageEventsComponent } from './events/admin-dashboard/admin-manage/admin-manage-events/admin-manage-events.component';
import {MatPaginatorModule} from "@angular/material/paginator";
import { TableComponent } from './shared/table/table.component';
import { DataDirective } from './directives/data.directive';
import { DisplayedColumnsDirective } from './directives/displayed-columns.directive';
import { ActionsDirective } from './directives/actions.directive';
import {MatSortModule} from "@angular/material/sort";
import { TruncateTextPipe } from './pipes/truncate-text.pipe';
import { LocationNamePipe } from './pipes/location-name.pipe';
import { PopupMenuComponent } from './shared/popup-menu/popup-menu.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatSelectModule} from "@angular/material/select";
import { ObjectTypeDirective } from './directives/object-type.directive';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";



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
    LocationComponent,
    AccountMenuComponent,
    LocationsMenuComponent,
    TicketsComponent,
    AdminDashboardComponent,
    PageNotFoundComponent,
    AdminHomeComponent,
    AdminManageComponent,
    AdminStatisticsComponent,
    AdminManageUsersComponent,
    AdminManageLocationsComponent,
    AdminManageEventsComponent,
    DataDirective,
    DisplayedColumnsDirective,
    TableComponent,
    ActionsDirective,
    TruncateTextPipe,
    LocationNamePipe,
    PopupMenuComponent,
    ObjectTypeDirective,
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
        NgOptimizedImage,
        MatTabsModule,
        MatSidenavModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatDialogModule,
        MatExpansionModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule
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
