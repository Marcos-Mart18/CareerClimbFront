import { Component } from '@angular/core';
import { Acceso } from '../../model/acceso';
import { AccesoService } from '../../service/acceso.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RolService } from '../../service/rol.service';
import { Rol } from '../../model/rol';
import { AccesoRol } from '../../model/acceso-rol';
import { AccesoRolService } from '../../service/acceso-rol.service';

@Component({
  selector: 'app-acceso',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    DialogModule,
    RouterModule,
    InputTextModule,
    FormsModule,
    ConfirmDialogModule,
    ToastModule,
    DropdownModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './acceso.component.html',
  styleUrl: './acceso.component.css',
})
export class AccesoComponent {
  accesos: Acceso[] = [];
  // roles: Rol[] = [];
  // accesosRoles: AccesoRol[] = [];
  acceso: Acceso = new Acceso(0, '', '', '', 'A', undefined, [], false);
  opcionesAccesoPadre: { idAcceso: number; titulo: string }[] = [];
  // accesoRol: AccesoRol = new AccesoRol();
  // rol: Rol = new Rol(0, '', '');
  visible: boolean = false;
  isEditing: boolean = false;

  constructor(
    private accesoService: AccesoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    // private rolService: RolService,
    // private accesoRolService: AccesoRolService
  ) {}

  ngOnInit() {
    this.listarAccesos();
    // this.listarRoles();
    this.listarAccesosPadres(); 
  }

  listarAccesos(): void {
    this.accesoService.getAccesos().subscribe((data) => {
      this.accesos = data.sort((a, b) => a.idAcceso - b.idAcceso); // Ordena por idAcceso de menor a mayor
    });
  }

  listarAccesosPadres(): void {
    this.accesoService.getAccesos().subscribe(
      (data) => {
        this.opcionesAccesoPadre = data.map((acceso) => ({
          idAcceso: acceso.idAcceso,
          titulo: acceso.titulo,
        }));
      },
      (error) => {
        console.error('Error al obtener accesos padres:', error);
      }
    );
  }
  
  
  

  // listarRoles(): void {
  //   this.rolService.getRoles().subscribe((data) => {
  //     this.roles = data.sort((a, b) => a.idRol - b.idRol); // Ordena por idRol de menor a mayor
  //   });
  // }

  // listarAccesosRoles(): void {
  //   this.accesoRolService.getAccesoRoles().subscribe((data) => {
  //     this.accesosRoles = data.sort((a, b) => a.idAccesoRol - b.idAccesoRol);
  //   });
  // }

  showDialogCreate(): void {
    this.visible = true;
    this.acceso = new Acceso(0, '', '', '', 'A'); // Inicializa con estado activo
    this.isEditing = false;
  }

  showDialogEdit(id: number): void {
    this.accesoService.getAccesoById(id).subscribe({
      next: (data) => {
        this.acceso = new Acceso(
          data.idAcceso,
          data.titulo,
          data.url,
          data.icono,
          data.isActive,
          data.accesoPadre, // Mapear el acceso padre correctamente
          data.subAccesos || [], // Asegurar que los subaccesos sean un array
          data.isExpanded
        );
        this.visible = true;
        this.isEditing = true;
      },
      error: (error) => console.error('Error al cargar el acceso:', error),
    });
  }
  

  deleteAcceso(id: number): void {
    this.confirmationService.confirm({
      message: '¿Está seguro de eliminar este acceso?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.accesoService.eliminarAcceso(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Correcto',
              detail: 'Acceso eliminado con éxito',
            });
            this.listarAccesos();
          },
          error: () =>
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar el acceso',
            }),
        });
      },
    });
  }
  
  guardarAcceso(): void {
    // Crear un objeto simplificado para enviar al backend
    const accesoParaGuardar: Partial<Acceso> = {
  idAcceso: this.acceso.idAcceso,
  titulo: this.acceso.titulo,
  url: this.acceso.url,
  icono: this.acceso.icono,
  isActive: this.acceso.isActive,
  accesoPadre: this.acceso.accesoPadre ? { idAcceso: this.acceso.accesoPadre.idAcceso } : null,
};
delete accesoParaGuardar.subAccesos; 
delete accesoParaGuardar.isExpanded;

  
    console.log('Objeto enviado:', accesoParaGuardar);
  
    const request = this.isEditing
      ? this.accesoService.editarAcceso(accesoParaGuardar as Acceso)
      : this.accesoService.crearAcceso(accesoParaGuardar as Acceso);
  
    request.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: this.isEditing ? 'Acceso actualizado' : 'Acceso creado',
        });
        this.listarAccesos();
        this.visible = false;
      },
      error: (err) => {
        console.error('Error al guardar el acceso:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ocurrió un error al guardar el acceso',
        });
      },
    });
  }
  
  
  
  
  
  
  
  
  
  
  
}
