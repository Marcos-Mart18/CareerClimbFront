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

export const routes: Routes = [
    {
        path:'',
        component: LoginComponent,
        title:'Login'
    },
    {
        path:'solicitud',
        component: SolicitudComponent,
        title:'Página solicitud',
        canActivate: [AuthGuard] 
    },
    {
        path:'ppp',
        component: PPPComponent,
        title:'Página PPP'
    },
    {
        path:'dashboard',
        component: DashboardComponent,
        title:'Dashboard',
        // canActivate: [AuthGuard] 
    },
    {
        path:'layout',
        component: LayoutComponent,
        // canActivate: [AuthGuard] ,
        children:[
            {
                path:'acceso',
                component: AccesoComponent,
                title:'Página acceso'
            },
            {
                path:'perfilUsuario',
                component: PerfilUsuarioComponent,
                title:'Página PerfilUsuario'
            }
        ]
    },
    {
        path:'**',
        redirectTo:'',
        pathMatch:'full'
    }
];
