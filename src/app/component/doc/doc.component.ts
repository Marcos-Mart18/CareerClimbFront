import { Component, ViewChild, ElementRef } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { DocService } from '../../service/doc.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SafePipe } from '../../pipes/safe.pipe';
import { Doc } from '../../model/doc';

@Component({
  selector: 'app-doc',
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
    SafePipe,
  ],
  templateUrl: './doc.component.html',
  styleUrls: ['./doc.component.css'],
})
export class DocComponent {
  docs: Doc[] = [];
  docsSubidos: number = 0;
  selectedFile: File | null = null;
  selectedFileType: string = '';
  isUploading: boolean = false;
  progress: number = 0;
  modalVisible: boolean = false;
  archivoUrl: string | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private docService: DocService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.listarArchivos();
  }

  listarArchivos() {
    this.docService.getFiles().subscribe((data) => {
      this.docs = data;
      this.docsSubidos = this.docs.length;
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const archivoExistente = this.docs.find(
        (doc) => doc.name === this.selectedFile?.name && doc.size === this.selectedFile?.size
      );

      if (archivoExistente) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Archivo duplicado',
          detail: `El archivo "${this.selectedFile.name}" ya ha sido subido anteriormente.`,
        });
        this.removeSelectedFile();
        return;
      }

      this.selectedFileType = this.selectedFile.type;

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
            detail: 'El archivo ha sido cargado exitosamente.',
          });
        }
      }, 500);
    }
  }

  getFileIcon(fileType: string): string {
    if (fileType === 'application/pdf') {
      return 'assets/icons/ext-pdf-min.png';
    } else if (
      fileType === 'application/msword' ||
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      return 'assets/icons/ext-doc-min.png';
    }
    return 'assets/icons/default-icon.png';
  }

  confirmDeleteDoc(id: number) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar este archivo?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteDoc(id);
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelado',
          detail: 'Has cancelado la operación',
        });
      },
    });
  }

  deleteDoc(id: number) {
    this.docService.deleteFile(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'El archivo ha sido eliminado exitosamente',
        });
        this.listarArchivos();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el archivo',
        });
      },
    });
  }

  confirmSaveDoc() {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas subir este archivo?',
      header: 'Confirmar Acción',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.uploadDoc();
      },
    });
  }

  uploadDoc(): void {
    if (this.selectedFile) {
      this.isUploading = true;
      this.progress = 0;

      this.docService.uploadFiles([this.selectedFile]).subscribe({
        next: (messages: string[]) => {
          this.isUploading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Archivo Enviado',
            detail: messages[0] || 'El archivo ha sido enviado exitosamente.',
          });
          this.listarArchivos();
          this.selectedFile = null;
          this.progress = 0;
        },
        error: () => {
          this.isUploading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo enviar el archivo.',
          });
        },
      });
    }
  }

  downloadDoc(id: number, name: string) {
    if (id && id !== 0) {
      this.docService.getFileForPreview(id).subscribe((blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = name;
        anchor.click();
        window.URL.revokeObjectURL(url);
      });
    } else if (this.selectedFile) {
      const url = window.URL.createObjectURL(this.selectedFile);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = this.selectedFile.name;
      anchor.click();
      window.URL.revokeObjectURL(url);
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Descarga no disponible',
        detail: 'Este archivo aún no ha sido enviado.',
      });
    }
  }

  visualizarDocEnModal(id: number) {
    const docSeleccionado = this.docs.find((doc) => doc.id === id);

    if (docSeleccionado && docSeleccionado.type.includes('word')) {
      const fileUrl = encodeURIComponent(docSeleccionado.url);
      this.archivoUrl = `https://view.officeapps.live.com/op/view.aspx?src=${fileUrl}`;
      this.modalVisible = true;
    } else if (id && id !== 0) {
      this.docService.getFileForPreview(id).subscribe((blob: Blob) => {
        this.archivoUrl = window.URL.createObjectURL(blob);
        this.modalVisible = true;
      });
    } else if (this.selectedFile) {
      this.archivoUrl = window.URL.createObjectURL(this.selectedFile);
      this.modalVisible = true;
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Visualización no disponible',
        detail: 'Este archivo aún no ha sido enviado.',
      });
    }
  }

  cerrarModal() {
    this.modalVisible = false;
    this.archivoUrl = null;
  }

  removeSelectedFile() {
    this.selectedFile = null;
    this.selectedFileType = '';
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
