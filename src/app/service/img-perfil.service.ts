import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ImgPerfil } from '../model/img-perfil'; // Clase que define el modelo para ImgPerfil

@Injectable({
  providedIn: 'root',
})
export class ImgPerfilService {
  private baseUrl = 'http://localhost:8080/api/imgManager';

  constructor(private http: HttpClient) {}

  // Método para listar todas las imágenes (metadatos)
  getImages(): Observable<ImgPerfil[]> {
    return this.http.get<ImgPerfil[]>(`${this.baseUrl}/images`).pipe(
      map((data: any[]) =>
        data.map(
          (img) =>
            new ImgPerfil(
              img.id,
              img.url,
              img.type,
              img.size,
              img.fechaSubida, // Fecha de subida
              0, // Inicializamos uploadProgress en 0
              img.idPerfilUsuario // ID del perfil de usuario asociado
            )
        )
      )
    );
  }

  // Método para obtener los metadatos de una imagen específica por ID
  getImageMetadata(id: number): Observable<ImgPerfil> {
    return this.http.get<ImgPerfil>(`${this.baseUrl}/images/${id}`).pipe(
      map(
        (img) =>
          new ImgPerfil(
            img.id,
            img.url,
            img.type,
            img.size,
            img.fechaSubida, // Fecha de subida
            0, // Inicializamos uploadProgress en 0
            img.idPerfilUsuario // ID del perfil de usuario asociado
          )
      )
    );
  }

  // Método para obtener el contenido binario de una imagen específica para visualizarla
  getImageForPreview(id: number): Observable<Blob> {
    const url = `${this.baseUrl}/images/view/${id}`; // Endpoint para obtener el contenido binario
    return this.http.get(url, { responseType: 'blob' }); // responseType debe ser 'blob' para obtener contenido binario
  }

  // Método para subir una o más imágenes, asociándolas a un perfil de usuario
  uploadImages(files: File[], idPerfilUsuario: number): Observable<string[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append('file', file, file.name));

    // Agregar el idPerfilUsuario como parámetro
    formData.append('perfilUsuarioId', idPerfilUsuario.toString());

    return this.http
      .post<any>(`${this.baseUrl}/upload`, formData)
      .pipe(map((responses: any[]) => responses.map((res) => res.message)));
  }

  // Método para eliminar una imagen específica por ID
  deleteImage(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/images/${id}`, {
      responseType: 'text', // Se espera una respuesta en texto plano
    });
  }

  updateImage(id: number, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file, file.name);
  
    return this.http.put<any>(`${this.baseUrl}/images/${id}`, formData).pipe(
      map((response: any) => response.message)
    );
  }

  // Método para obtener la URL de una imagen específica por ID
  getImageUrl(id: number): Observable<ImgPerfil> {
    const url = `${this.baseUrl}/images/url/${id}`; // Endpoint para obtener la URL de la imagen
    
    return this.http.get(url).pipe(
      map((response: any) => {
        // Validamos que la respuesta tenga los campos esperados
        if (!response || !response.id || !response.url || !response.type || !response.size) {
          throw new Error('Respuesta inválida del servidor al obtener la URL de la imagen');
        }
  
        // Creamos el objeto ImgPerfil asignando valores predeterminados para los campos adicionales
        return new ImgPerfil(
          response.id,
          response.url, // URL completa de la imagen
          response.type,
          response.size,
          '', // fechaSubida (no viene del backend en este caso, se inicializa vacía)
          0, // uploadProgress (inicializado en 0 porque no es parte de la respuesta)
          response.idPerfilUsuario // ID del usuario asociado, opcional
        );
      }),
      catchError((error) => {
        console.error('Error al obtener la URL de la imagen:', error);
        return throwError(() => new Error('No se pudo obtener la URL de la imagen'));
      })
    );
  }
  
  

  
}
