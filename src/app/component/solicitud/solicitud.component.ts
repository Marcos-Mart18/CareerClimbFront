import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { Solicitud } from '../../model/solicitud';
import { SolicitudService } from '../../service/solicitud.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import Swal from 'sweetalert2';
import { AuthService } from '../../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-solicitud',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TableModule,
    TagModule,
    InputTextModule,
    DropdownModule,
    FormsModule,
    DialogModule,
    ReactiveFormsModule,
  ],
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.css'],
})
export class SolicitudComponent implements OnInit {
  solicitudes: Solicitud[] = []; // Almacena las solicitudes obtenidas
  statuses: any[] = []; // Ejemplo de uso futuro para estados o categorías
  visible: boolean = false; // Controla la visibilidad del diálogo
  loading: boolean = true; // Indica si se están cargando datos
  isUpdate: boolean = false; // Indica si se está actualizando un registro
  formPPP!: FormGroup; // Formulario reactivo

  constructor(
    private solicitudService: SolicitudService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.listarSolicitudes();
  }

  // Inicializa los campos del formulario
  inicializarFormulario(): void {
    this.formPPP = this.fb.group({
      razonsocial: [''],
      ruc: [''],
      emEmail: [''],
      representante: [''],
      re_cargo: [''],
      re_email: [''],
    });
  }

  // Carga la lista de solicitudes
  listarSolicitudes(): void {
    this.loading = true;
    this.solicitudService.getSolicitudes().subscribe(
        (data: Solicitud[]) => {
            // Ordenar las solicitudes por id de forma ascendente
            this.solicitudes = data.sort((a, b) => a.idsolicitud - b.idsolicitud);
            console.log('Solicitudes obtenidas:', this.solicitudes);
            this.loading = false;
        },
        (error) => {
            console.error('Error al obtener las solicitudes:', error);
            this.loading = false; // Siempre finaliza el loading
        }
    );
}


  // Abre el diálogo para crear una nueva solicitud
  showDialog(): void {
    this.visible = true;
    this.isUpdate = false;
  }

  // Envía los datos del formulario para crear una nueva solicitud
  CrearSolicitud(): void {
    if (this.formPPP.valid) {
      console.log('Datos enviados:', this.formPPP.value);
      this.solicitudService.crearSolicitud(this.formPPP.value).subscribe({
        next: (resp) => {
          if (resp) {
            this.mostrarToast('success', 'Solicitud creada correctamente');
            this.listarSolicitudes();
            this.formPPP.reset();
            this.visible = false; // Cierra el diálogo después de crear
          }
        },
        error: (err) => {
          console.error('Error creando la solicitud:', err);
          this.mostrarToast('error', 'Error al crear la solicitud');
        },
      });
    } else {
      console.warn('El formulario es inválido:', this.formPPP.value);
      this.mostrarToast('warning', 'Por favor, complete todos los campos');
    }
  }

  // Muestra una notificación personalizada usando SweetAlert2
  private mostrarToast(icon: 'success' | 'error' | 'warning', mensaje: string): void {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon,
      title: mensaje,
    });
  }

  get isStudent(): boolean {
    return this.authService.hasRole('ROLE_ESTUDIANTE');
  }
  
  get isCoordinatorPPP(): boolean {
    return this.authService.hasRole('ROLE_COORDINADORPPP');
  }
  
  get isSupervisor(): boolean {
    return this.authService.hasRole('ROLE_SUPERVISOR');
  }
  
  get isSecretary(): boolean {
    return this.authService.hasRole('ROLE_SECRETARIA');
  }
}
