import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { LoginGuard } from '../services/guards/login.guard';
import { ProfileComponent } from './profile/profile.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { HospitalesComponent } from './hospitales/hospitales.component';
import { MedicosComponent } from './medicos/medicos.component';
import { MedicoComponent } from './medicos/medico.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { AdminGuard } from '../services/guards/admin.guard';
import { VerificaTokenGuard } from '../services/guards/verifica-token.guard';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    canActivate: [LoginGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [VerificaTokenGuard],
        data: { titulo: 'Dashboard' }
      },
      {
        path: 'progress',
        component: ProgressComponent,
        data: { titulo: 'Progress' }
      },
      {
        path: 'graficas',
        component: Graficas1Component,
        data: { titulo: 'Gráficas' }
      },
      {
        path: 'promesas',
        component: PromesasComponent,
        data: { titulo: 'Promesas' }
      },
      {
        path: 'account-settings',
        component: AccountSettingsComponent,
        data: { titulo: 'Ajustes de tema' }
      },
      {
        path: 'perfil',
        component: ProfileComponent,
        data: { titulo: 'Perfil de usuario' }
      },
      {
        path: 'busqueda/:termino',
        component: BusquedaComponent,
        data: { titulo: 'Buscador' }
      },
      {
        path: 'usuarios',
        component: UsuariosComponent,
        canActivate: [AdminGuard],
        data: { titulo: 'Mantenimiento de usuario' }
      },
      {
        path: 'hospitales',
        component: HospitalesComponent,
        data: { titulo: 'Mantenimiento de hospitales' }
      },
      {
        path: 'medicos',
        component: MedicosComponent,
        data: { titulo: 'Mantenimiento de médicos' }
      },
      {
        path: 'medico/:id',
        component: MedicoComponent,
        data: { titulo: 'Actualizar médico' }
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }