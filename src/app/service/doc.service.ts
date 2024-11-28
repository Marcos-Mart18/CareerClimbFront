import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Doc } from '../model/doc'; 

@Injectable({
  providedIn: 'root',
})
export class DocService {
  private baseUrl = 'http://localhost:8080/api/docManager'; 

  constructor(private http: HttpClient) {}

  getFiles(): Observable<Doc[]> {
    return this.http.get<Doc[]>(`${this.baseUrl}/files`).pipe(
      map((data: any[]) =>
        data.map(
          (file) =>
            new Doc(
              file.id,
              file.name,
              file.url,
              file.type,
              file.size,
              file.fechaSubida,
              0, 
              file.idDetalleDoc 
            )
        )
      )
    );
  }

  getFileMetadata(id: number): Observable<Doc> {
    return this.http.get<Doc>(`${this.baseUrl}/files/${id}`).pipe(
      map(
        (file) =>
          new Doc(
            file.id,
            file.name,
            file.url,
            file.type,
            file.size,
            file.fechaSubida,
            0, 
            file.idDetalleDoc          )
      )
    );
  }

  getFileForPreview(id: number): Observable<Blob> {
    const url = `${this.baseUrl}/files/view/${id}`; 
    return this.http.get(url, { responseType: 'blob' }); 
  }

  uploadFiles(files: File[], idDetalleDoc?: number): Observable<string[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append('file', file, file.name));

    if (idDetalleDoc !== undefined && idDetalleDoc !== null) {
      formData.append('idDetalleDoc', idDetalleDoc.toString());
    }

    return this.http
      .post<any>(`${this.baseUrl}/upload`, formData)
      .pipe(map((responses: any[]) => responses.map((res) => res.message)));
  }

  deleteFile(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/files/${id}`, {
      responseType: 'text',
    });
  }
}
