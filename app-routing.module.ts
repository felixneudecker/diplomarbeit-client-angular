import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './views/settings/settings.component'; 
import { AllChartsComponent } from './views/all-charts/all-charts.component';
import { AddDiagramComponent } from './views/add-diagram/add-diagram.component';
import { AddDatasourceComponent } from './views/add-datasource/add-datasource.component';
import { ManageDatasourcesComponent } from './views/manage-datasources/manage-datasources.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { ViewSettingsComponent } from './views/navigation-view/view-settings/view-settings.component';
import { AddViewComponent } from './views/navigation-view/add-view/add-view.component';
import { DiagramSettingsComponent } from './views/diagram-settings/diagram-settings.component';


const routes: Routes = [
  { path: '', redirectTo : 'login', pathMatch : 'full' },
  { path : 'login', component : LoginComponent},
  { path : 'register', component : RegisterComponent},
  { path : 'settings', component : SettingsComponent},
  { path : 'allCharts', component : AllChartsComponent},
  { path : 'addDiagram', component : AddDiagramComponent},
  { path : 'addDatasource', component : AddDatasourceComponent},
  { path : 'manageDatasources', component : ManageDatasourcesComponent},
  { path : 'viewSettings', component : ViewSettingsComponent},
  { path : 'addView', component : AddViewComponent},
  { path : 'diagramSettings', component: DiagramSettingsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
