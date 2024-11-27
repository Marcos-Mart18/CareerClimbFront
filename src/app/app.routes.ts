import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AccesoComponent } from './component/acceso/acceso.component';
import { PerfilUsuarioComponent } from './component/perfil-usuario/perfil-usuario.component';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './LayoutDefault/layout/layout.component';
import { SolicitudComponent } from './component/solicitud/solicitud.component';
import { PPPComponent } from './component/ppp/ppp.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { InsertarDatosComponent } from './component/insertar-datos/insertar-datos.component';
import { RolComponent } from './component/rol/rol.component';
import { CarreraComponent } from './component/carrera/carrera.component';
import { RubroComponent } from './component/rubro/rubro.component';
import { CargoComponent } from './component/cargo/cargo.component';
import { SoliCordComponent } from './compWeb/soli-cord/soli-cord.component';
import { ConsolidadoComponent } from './component/consolidado/consolidado.component';
import { ImgPerfilComponent } from './component/img-perfil/img-perfil.component';
import { GestionAccesosRolesComponent } from './component/gestion-accesos-roles/gestion-accesos-roles.component';

export const routes: Routes = [
    {
    path: '',
    component: LoginComponent,
    title: 'Login',
    },
    {
        path: 'solicitud',
    component: SolicitudComponent,
    title: 'Página solicitud',
    canActivate: [AuthGuard],
    },
    {
        path: 'ppp',
        component: PPPComponent,
        title: 'Página PPP',
    },
    {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Dashboard',
    // canActivate: [AuthGuard]
    },
    {
    path: 'layout',
    component: LayoutComponent,
    // canActivate: [AuthGuard] ,
    children: [
        {
        path: 'insertarDatos',
        component: InsertarDatosComponent,
        title: 'Página InsertarDatos',
        },
        {
        path: 'accesos',
        component: AccesoComponent,
        title: 'Página accesos',
        },
        {
            path: 'roles',
        component: RolComponent,
        title: 'Página roles',
        },
        {
        path: 'carreras',
        component: CarreraComponent,
        title: 'Página carreras',
        },
        {
        path: 'rubros',
        component: RubroComponent,
        title: 'Página rubros',
        },
        {
        path: 'cargos',
        component: CargoComponent,
        title: 'Página cargos',
        },
        {
        path:'solicitudes-practica',
        component: SoliCordComponent,
        title:'Página SolicitudCord'
        },
        {
        path:'consolidado',
        component: ConsolidadoComponent,
        title:'Página consolidado'
        },
        {
        path:'perfilUsuario',
        component: ImgPerfilComponent,
        title:'Página Perfil'
        },
        {
            path: 'gestionPermisos',
            component: GestionAccesosRolesComponent,
        title: 'Página Gestion de Permisos',
        }
    ],
},
{
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
},
];
