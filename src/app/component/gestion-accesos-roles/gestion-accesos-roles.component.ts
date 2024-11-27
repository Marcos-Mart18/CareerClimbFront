import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { AccesoComponent } from '../acceso/acceso.component';
import { RolComponent } from '../rol/rol.component';
import { AccesoRolComponent } from '../acceso-rol/acceso-rol.component';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-gestion-accesos-roles',
  standalone: true,
  imports: [NgIf,AccesoComponent,RolComponent,AccesoRolComponent,ButtonModule],
  templateUrl: './gestion-accesos-roles.component.html',
  styleUrls: ['./gestion-accesos-roles.component.css'],
})
export class GestionAccesosRolesComponent {
  selectedTab: string = 'acceso'; // Pestaña por defecto

  // Método para cambiar de pestaña
  cambiarTab(tab: string): void {
    this.selectedTab = tab;
  }
}
