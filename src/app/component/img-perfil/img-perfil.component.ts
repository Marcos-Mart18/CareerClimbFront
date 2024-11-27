import { Component, ViewChild, ElementRef } from '@angular/core';
import { ImgPerfil } from '../../model/img-perfil';
import { ImgPerfilService } from '../../service/img-perfil.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-img-perfil',
  standalone: true,
  imports: [
    TableModule,
    CommonModule,
    ButtonModule,
    RouterModule,
    InputTextModule,
    FormsModule,
    ConfirmDialogModule,
    DialogModule,
    ToastModule,
  ],
  templateUrl: './img-perfil.component.html',
  styleUrls: ['./img-perfil.component.css'],
})
export class ImgPerfilComponent {
  imagenes: ImgPerfil[] = [];
  titulo: string = 'Subir Imagen de Perfil';
  selectedImage: File | null = null;
  selectedImageUrl: string | null = null;
  modalVisible: boolean = false;
  imagenUrl: string | null = null;

  // Variables para la simulación de carga
  isUploading: boolean = false;
  progress: number = 0;

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private imgPerfilService: ImgPerfilService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.listarImagenes();
  }

  listarImagenes() {
    this.imgPerfilService.getImages().subscribe({
      next: (data) => {
        this.imagenes = data;
        this.imagenes.forEach((img) => {
          this.imgPerfilService.getImageUrl(img.id).subscribe({
            next: (response) => {
              img.url = response.url; // Asigna la URL generada por el backend
              console.log(`URL generado para la imagen ID ${img.id}: ${img.url}`); // Verifica la URL
            },
            error: (err) => {
              console.error(`Error al obtener la URL para la imagen con ID ${img.id}`, err);
              img.url = 'assets/placeholder.png'; // Usa un placeholder en caso de error
            },
          });
        });
      },
      error: (err) => {
        console.error('Error al listar imágenes', err);
      },
    });
  }
  

  onImageSelected(event: any) {
    this.selectedImage = event.target.files[0];
    if (this.selectedImage) {
      this.selectedImageUrl = URL.createObjectURL(this.selectedImage);

      // Simula la carga de la imagen
      this.isUploading = true;
      this.progress = 0;

      const uploadInterval = setInterval(() => {
        if (this.progress < 100) {
          this.progress += 10;
        } else {
          clearInterval(uploadInterval);
          this.isUploading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Carga completada',
            detail: 'La imagen se ha cargado exitosamente.',
          });
        }
      }, 500);
    }
  }

  confirmDeleteImagen(id: number) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar esta imagen?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteImagen(id);
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelado',
          detail: 'Has cancelado la operación.',
        });
      },
    });
  }

  deleteImagen(id: number) {
    this.imgPerfilService.deleteImage(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminada',
          detail: 'La imagen ha sido eliminada exitosamente.',
        });
        this.listarImagenes();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar la imagen.',
        });
      },
    });
  }

  confirmSaveImagen() {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas subir esta imagen?',
      header: 'Confirmar Acción',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.uploadImagen();
      },
    });
  }

  uploadImagen() {
    if (this.selectedImage) {
      this.imgPerfilService.uploadImages([this.selectedImage], 1).subscribe({
        next: (messages: string[]) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Imagen Subida',
            detail: messages[0] || 'La imagen se ha subido exitosamente.',
          });
          this.listarImagenes();
          this.selectedImage = null;
          this.selectedImageUrl = null;
          this.progress = 0;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo subir la imagen.',
          });
        },
      });
    }
  }

  downloadImagen(id: number, name: string) {
    this.imgPerfilService.getImageForPreview(id).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = name;
      anchor.click();
      window.URL.revokeObjectURL(url);
    });
  }

  visualizarImagenEnModal(id: number) {
    const imagenSeleccionada = this.imagenes.find((imagen) => imagen.id === id);
    if (imagenSeleccionada) {
      this.imgPerfilService.getImageForPreview(id).subscribe((blob: Blob) => {
        this.imagenUrl = window.URL.createObjectURL(blob);
        this.modalVisible = true;
      });
    }
  }

  cerrarModal() {
    this.modalVisible = false;
    this.imagenUrl = null;
  }

  removeSelectedImage() {
    this.selectedImage = null;
    this.selectedImageUrl = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  onUpdateImage(id: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      this.imgPerfilService.updateImage(id, file).subscribe({
        next: (message) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Imagen actualizada',
            detail: message,
          });
          this.listarImagenes();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar la imagen.',
          });
        },
      });
    }
  }
}
