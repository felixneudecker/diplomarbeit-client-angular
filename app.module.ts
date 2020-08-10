import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MaterialModuleModule } from './material-module/material-module.module';
import { SettingsComponent } from './views/settings/settings.component';
import { AllChartsComponent } from './views/all-charts/all-charts.component';
import { NavigationComponent } from './views/navigation-view/navigation.component';
import { BottomNavigationComponent } from './views/bottom-navigation/bottom-navigation.component';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { ManageDatasourcesComponent } from './views/manage-datasources/manage-datasources.component';
import { AddDatasourceComponent } from './views/add-datasource/add-datasource.component';
import { AddDiagramComponent } from './views/add-diagram/add-diagram.component'

import { DatasourceValueComponent } from './views/add-datasource/datasource-value/datasource-value.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { HttpService } from './services/http.service';
import { RegisterComponent } from './views/register/register.component';
import { LoginComponent } from './views/login/login.component';
import { ViewSettingsComponent } from './views/navigation-view/view-settings/view-settings.component';
import { AddViewComponent } from './views/navigation-view/add-view/add-view.component';
import { ShowChartsComponent } from './views/all-charts/show-charts/show-charts.component';
import { DiagramComponent } from './views/all-charts/show-charts/diagram/diagram.component'; 

import { ChartsModule } from 'ng2-charts';
import { DiagramSettingsComponent } from './views/diagram-settings/diagram-settings.component';

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    AllChartsComponent,
    NavigationComponent,
    BottomNavigationComponent,
    ManageDatasourcesComponent,
    AddDatasourceComponent,
    AddDiagramComponent,
    DatasourceValueComponent,
    RegisterComponent,
    LoginComponent,
    ViewSettingsComponent,
    AddViewComponent,
    ShowChartsComponent,
    DiagramComponent,
    DiagramSettingsComponent
    ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MaterialModuleModule,
    HttpClientModule,
    ChartsModule
  ],
  providers: [
    HttpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
