import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Rol } from '../../model/rol';
import { RolService } from '../../service/rol.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-rol',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ConfirmDialogModule,
    ToastModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './rol.component.html',
  styleUrl: './rol.component.css',
})
export class RolComponent {
  roles: Rol[] = [];
  rol: Rol = new Rol(0, '', ''); // Modelo inicial para crear/editar
  visible: boolean = false;
  isEditing: boolean = false;

  constructor(
    private rolService: RolService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.listarRoles();
  }

  listarRoles(): void {
    this.rolService.getRoles().subscribe({
      next: (data: Rol[]) => {
        this.roles = data.sort((a, b) => a.idRol - b.idRol); // Ordena por ID
      },
      error: (error) => {
        console.error('Error al obtener los roles', error);
      },
    });
  }

  showDialogCreate(): void {
    this.rol = new Rol(0, '', ''); // Inicializa el modelo vacío
    this.visible = true;
    this.isEditing = false;
  }

  showDialogEdit(id: number): void {
    this.rolService.getRolId(id).subscribe({
      next: (data) => {
        this.rol = { ...data }; // Asigna los datos del backend
        this.visible = true;
        this.isEditing = true;
      },
      error: (error) => {
        console.error('Error al obtener el rol', error);
      },
    });
  }

  guardarRol(): void {
    const request = this.isEditing
      ? this.rolService.editarRol(this.rol)
      : this.rolService.crearRol(this.rol);

    request.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: this.isEditing ? 'Rol actualizado' : 'Rol creado',
        });
        this.listarRoles();
        this.visible = false;
      },
      error: (error) => {
        console.error('Error al guardar el rol', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ocurrió un error al guardar el rol',
        });
      },
    });
  }

  deleteRol(id: number): void {
    this.confirmationService.confirm({
      message: '¿Está seguro de eliminar este rol?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.rolService.eliminarRol(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Correcto',
              detail: 'Rol eliminado con éxito',
            });
            this.listarRoles();
          },
          error: (error) => {
            console.error('Error al eliminar el rol', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Ocurrió un error al eliminar el rol',
            });
          },
        });
      },
    });
  }
}
