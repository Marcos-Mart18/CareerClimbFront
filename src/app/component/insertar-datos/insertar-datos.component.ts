import { Component } from '@angular/core';
import { InsertarDatosService } from '../../service/insertar-datos.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-insertar-datos',
  standalone: true,
  imports: [NgIf],
  templateUrl: './insertar-datos.component.html',
  styleUrl: './insertar-datos.component.css',
})
export class InsertarDatosComponent {
  selectedFile: File | null = null;
  uploadSuccess: boolean = false;
  uploadError: boolean = false;

  constructor(private uploadExcelService: InsertarDatosService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onUpload(event: Event): void {
    event.preventDefault();
    if (!this.selectedFile) return;

    this.uploadExcelService.uploadFile(this.selectedFile).subscribe({
      next: (response: string) => {
        console.log(response);
        this.uploadSuccess = true;
        this.uploadError = false;
      },
      error: (error) => {
        console.error(error);
        this.uploadSuccess = false;
        this.uploadError = true;
      },
    });
  }
}
