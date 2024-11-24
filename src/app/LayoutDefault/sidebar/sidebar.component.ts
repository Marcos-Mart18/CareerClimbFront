import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink, RouterModule, Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { AccesoService } from '../../service/acceso.service';
import { Acceso } from '../../model/acceso';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterModule, NgIf, NgClass, NgFor],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'], // Ajusta el plural aquí
})
export class SidebarComponent {
  isCollapsed = false; // Controla el estado colapsado de la barra lateral
  accesos: Acceso[] = []; // Lista de accesos obtenidos del backend
  rolSinPrefijo: string = ''; // Rol del usuario sin prefijo

  constructor(
    private authService: AuthService,
    private router: Router,
    private accesoService: AccesoService
  ) {}

  toggleSubAccesos(acceso: Acceso): void {
    acceso.isExpanded = !acceso.isExpanded;
  }
  
  /**
   * Maneja la navegación al seleccionar un subacceso.
   * @param url URL del subacceso seleccionado.
   */
  navigateTo(url: string): void {
    if (url) {
      this.router.navigate([url]);
    }
  }

  @Output() toggle = new EventEmitter<boolean>();

  /**
   * Alterna el estado colapsado de la barra lateral.
   */
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.toggle.emit(this.isCollapsed);
  }

  /**
   * Obtiene los accesos según el rol del usuario al inicializar el componente.
   */
  ngOnInit(): void {
    const roles = this.authService.getRolesSinPrefijo();
    if (roles.length > 0) {
      this.rolSinPrefijo = roles[0]; // Usa el primer rol disponible
      this.obtenerAccesosPorRol(this.rolSinPrefijo);
    } else {
      console.error('No se encontraron roles en el token.');
    }
  }

  /**
   * Llama al servicio para obtener los accesos según el rol.
   * @param rol Rol del usuario.
   */
  obtenerAccesosPorRol(rol: string): void {
    this.accesoService.getAccesosPorRol(rol).subscribe({
      next: (data) => {
        this.accesos = this.organizarAccesos(data);
        console.log('Accesos obtenidos:', this.accesos);
      },
      error: (err) => {
        console.error('Error al obtener accesos por rol:', err);
      },
    });
  }

  /**
   * Organiza la estructura jerárquica de accesos para asegurar que los subaccesos se asocien correctamente.
   * @param accesos Lista de accesos obtenidos del backend.
   * @returns Lista de accesos principales con subaccesos organizados.
   */
  private organizarAccesos(accesos: Acceso[]): Acceso[] {
    const accesoMap = new Map<number, Acceso>();

    // Crear un mapa de accesos por ID
    accesos.forEach((acceso) => {
      acceso.subAccesos = []; // Inicializa el arreglo de subAccesos
      accesoMap.set(acceso.idAcceso, acceso);
    });

    const accesosPrincipales: Acceso[] = [];

    accesos.forEach((acceso) => {
      if (acceso.accesoPadre) {
        const padre = accesoMap.get(acceso.accesoPadre.idAcceso);
        if (padre) {
          padre.subAccesos.push(acceso); // Agrega el subacceso al padre
        }
      } else {
        accesosPrincipales.push(acceso); // Es un acceso principal
      }
    });

    return accesosPrincipales;
  }

  /**
   * Cierra sesión y redirige al login.
   */
  logout() {
    this.authService.logout();
  }

  onSubaccesoChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedUrl = selectElement.value;
  
    if (selectedUrl) {
      this.navigateTo(selectedUrl); // Navegar a la URL seleccionada
    }
  }
  
}
