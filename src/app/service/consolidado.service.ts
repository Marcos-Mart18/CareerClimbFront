import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Consolidado } from '../model/consolidado';

@Injectable({
  providedIn: 'root',
})
export class ConsolidadoService {
  private baseUrl = 'http://localhost:8080/api/fileManager';

  constructor(private http: HttpClient) {}

  // Método para listar todos los archivos (metadatos)
  getFiles(): Observable<Consolidado[]> {
    return this.http.get<Consolidado[]>(`${this.baseUrl}/files`).pipe(
      map((data: any[]) =>
        data.map(
          (file) =>
            new Consolidado(
              file.id,
              file.name,
              file.url,
              file.type,
              file.size,
              file.fechaSubida, // Añadimos fechaSubida aquí
              0, // Valor inicial para uploadProgress
              file.detallePPPId // Añadimos detallePPPId aquí
            )
        )
      )
    );
  }

  // Método para obtener solo los metadatos de un archivo específico por ID
  getFileMetadata(id: number): Observable<Consolidado> {
    return this.http.get<Consolidado>(`${this.baseUrl}/files/${id}`).pipe(
      map(
        (file) =>
          new Consolidado(
            file.id,
            file.name,
            file.url,
            file.type,
            file.size,
            file.fechaSubida,
            0, // Valor inicial para uploadProgress
            file.idPPP
          )
      )
    );
  }

  // Método para obtener el contenido binario de un archivo específico para visualizarlo en un modal o descargarlo
  getFileForPreview(id: number): Observable<Blob> {
    const url = `${this.baseUrl}/files/view/${id}`; // Usamos el endpoint adecuado para obtener el contenido binario
    return this.http.get(url, { responseType: 'blob' }); // responseType debe ser 'blob' para contenido binario
  }

  // Método para subir uno o más archivos con opción de asociar un Detalle_PPP existente
  uploadFiles(files: File[], idPPP?: number): Observable<string[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append('file', file, file.name));

    // Verifica si detallePPPId está definido y no es null antes de agregarlo
    if (idPPP !== undefined && idPPP !== null) {
      formData.append('detallePPPId', idPPP.toString());
    }

    return this.http
      .post<any>(`${this.baseUrl}/upload`, formData)
      .pipe(map((responses: any[]) => responses.map((res) => res.message)));
  }

  // Método para eliminar un archivo específico por ID
  deleteFile(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/files/${id}`, {
      responseType: 'text',
    });
  }
}
