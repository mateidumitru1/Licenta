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
import { InputFieldsErrorComponent } from './shared/input-fields-error/input-fields-error.component';
import { HomeComponent } from './events/home/home.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatMenuModule} from "@angular/material/menu";
import { NavbarComponent } from './events/root/navbar/navbar.component';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatListModule} from "@angular/material/list";
import {MatCardModule} from "@angular/material/card";
import { LocationComponent } from './events/location/location.component';
import {EventComponent} from "./events/event/event.component";
import {NgOptimizedImage} from "@angular/common";
import { AccountMenuComponent } from './events/root/navbar/account-menu/account-menu.component';
import { LocationsMenuComponent } from './events/root/navbar/locations-menu/locations-menu.component';
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
import { TableComponent } from './events/admin-dashboard/admin-manage/table/table.component';
import { DataDirective } from './util/directives/data.directive';
import { DisplayedColumnsDirective } from './util/directives/displayed-columns.directive';
import { ActionsDirective } from './util/directives/actions.directive';
import {MatSortModule} from "@angular/material/sort";
import { TruncateTextPipe } from './util/pipes/truncate-text.pipe';
import { LocationNamePipe } from './util/pipes/location-name.pipe';
import { EditDeleteDialog } from './shared/dialog-menus/edit-delete-dialog/edit-delete-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatSelectModule} from "@angular/material/select";
import { ObjectTypeDirective } from './util/directives/object-type.directive';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import { EditLocationsComponent } from './shared/dialog-menus/edit-delete-dialog/edit/edit-locations/edit-locations.component';
import { EditUsersComponent } from './shared/dialog-menus/edit-delete-dialog/edit/edit-users/edit-users.component';
import { EditEventsComponent } from './shared/dialog-menus/edit-delete-dialog/edit/edit-events/edit-events.component';
import { DialogRefDirective } from './util/directives/dialog-ref.directive';
import { EditButtonsComponent } from './shared/dialog-menus/edit-delete-dialog/edit-buttons/edit-buttons.component';
import { FilterComponent } from './events/admin-dashboard/admin-manage/filter/filter.component';
import { IndexDirective } from './util/directives/index.directive';
import {MatRadioModule} from "@angular/material/radio";
import { AddDialogComponent } from './shared/dialog-menus/add-dialog/add-dialog.component';
import { AddUserComponent } from './shared/dialog-menus/add-dialog/add-user/add-user.component';
import { AddEventComponent } from './shared/dialog-menus/add-dialog/add-event/add-event.component';
import { AddLocationComponent } from './shared/dialog-menus/add-dialog/add-location/add-location.component';
import { RootComponent } from './events/root/root.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    InputFieldsErrorComponent,
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
    EditDeleteDialog,
    ObjectTypeDirective,
    EditLocationsComponent,
    EditUsersComponent,
    EditEventsComponent,
    DialogRefDirective,
    EditButtonsComponent,
    FilterComponent,
    IndexDirective,
    AddDialogComponent,
    AddUserComponent,
    AddEventComponent,
    AddLocationComponent,
    RootComponent,
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
    MatNativeDateModule,
    MatRadioModule
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
