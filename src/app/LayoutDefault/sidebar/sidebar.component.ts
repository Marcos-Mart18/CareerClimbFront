import {NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink, RouterModule,Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { AccesoService } from '../../service/acceso.service';
import { Acceso } from '../../model/acceso';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink,RouterModule,NgIf,NgClass,NgFor],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  isCollapsed= false;
  accesos:Acceso[]=[];
  rolSinPrefijo: string = '';
  constructor(private authService: AuthService,private router: Router,private accesoService:AccesoService) {}


  @Output() toggle = new EventEmitter<boolean>(); 

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed; 
    this.toggle.emit(this.isCollapsed); 
  }

  // Obtén el rol del token y los accesos relacionados
  ngOnInit(): void {
    const roles = this.authService.getRolesSinPrefijo();
    if (roles.length > 0) {
      this.rolSinPrefijo = roles[0]; // Usa el primer rol (o adapta según tu lógica)
      this.obtenerAccesosPorRol(this.rolSinPrefijo);
    } else {
      console.error('No se encontraron roles en el token.');
    }
  }

  // Llama al servicio para obtener accesos por rol
  obtenerAccesosPorRol(rol: string): void {
    this.accesoService.getAccesosPorRol(rol).subscribe({
      next: (data) => {
        this.accesos = data;
        console.log('Accesos obtenidos:', this.accesos);
      },
      error: (err) => {
        console.error('Error al obtener accesos por rol:', err);
      },
    });
  }




  logout() {
    this.authService.logout();
  }

  
}
