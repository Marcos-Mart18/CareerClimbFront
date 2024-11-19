import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccesoRol } from '../model/acceso-rol';

@Injectable({
  providedIn: 'root'
})
export class AccesoRolService {
  private apiUrl ='http://localhost:8080/api/v1/carrera';
  constructor(private http: HttpClient) { }

  getAccesoRoles(): Observable<AccesoRol[]> {
    return this.http.get<AccesoRol[]>(this.apiUrl);
  }
  getAccesoRolById(idAccesoRol: number): Observable<AccesoRol> {
    return this.http.get<AccesoRol>(`${this.apiUrl}/${idAccesoRol}`);
  }
  crearAccesoRol(acceso: AccesoRol): Observable<AccesoRol> {
    return this.http.post<AccesoRol>(this.apiUrl, acceso);
  }
  editarAccesoRol(acceso: AccesoRol):Observable<AccesoRol>{
    return this.http.post<AccesoRol>(this.apiUrl,acceso);
  }
  eliminarAccesoRol(idAccesoRol: number) {
    return this.http.delete(`${this.apiUrl}/${idAccesoRol}`);
  }
}
