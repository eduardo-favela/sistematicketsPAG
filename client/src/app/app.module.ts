import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AutocompleteLibModule } from 'angular-ng-autocomplete'
import { DpDatePickerModule } from 'ng2-date-picker';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Route, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'
import { SidebarModule } from 'ng-sidebar';
import { registerLocaleData } from '@angular/common'
import localeEs from '@angular/common/locales/es-MX';
import { NgxGaugeModule } from 'ngx-gauge';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { VerreportesComponent } from './components/verreportes/verreportes.component';
import { LoginComponent } from './components/login/login.component';
import { NgbPaginationModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap'
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { MngServiciosComponent } from './components/mng-servicios/mng-servicios.component';
import * as $ from 'jquery';
import { DataTablesModule } from 'angular-datatables';
import * as bootstrap from 'bootstrap';
import { EmpleadosEquiposComponent } from './components/empleados-equipos/empleados-equipos.component';
import { EstadisticosComponent } from './components/estadisticos/estadisticos.component';

registerLocaleData(localeEs)


const routes: Route[] = [
  { path: '', component: HomeComponent },
  { path: 'vereportes', component: VerreportesComponent },
  { path: 'mngusuarios', component: UsuariosComponent },
  { path: 'mngservicios', component: MngServiciosComponent },
  { path: 'mngcolaboradores', component: EmpleadosEquiposComponent },
  { path: 'estadisticos', component: EstadisticosComponent },
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    VerreportesComponent,
    LoginComponent,
    UsuariosComponent,
    MngServiciosComponent,
    EmpleadosEquiposComponent,
    EstadisticosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    SidebarModule,
    HttpClientModule,
    FormsModule,
    AutocompleteLibModule,
    DpDatePickerModule,
    NgxGaugeModule,
    NgbModule,
    NgbPaginationModule,
    NgbAlertModule,
    DataTablesModule,
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
