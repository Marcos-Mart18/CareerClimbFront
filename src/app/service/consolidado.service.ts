import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Consolidado } from '../model/consolidado';

@Injectable({
  providedIn: 'root'
})
export class ConsolidadoService {
  private apiUrl ='http://localhost:8080/api/v1/carrera';
  constructor(private http: HttpClient) { }

  getConsolidados(): Observable<Consolidado[]> {
    return this.http.get<Consolidado[]>(this.apiUrl);
  }
  getConsolidadoById(idConsolidado: number): Observable<Consolidado> {
    return this.http.get<Consolidado>(`${this.apiUrl}/${idConsolidado}`);
  }
  crearConsolidado(consolidado: Consolidado): Observable<Consolidado> {
    return this.http.post<Consolidado>(this.apiUrl, consolidado);
  }
  editarConsolidado(consolidado: Consolidado):Observable<Consolidado>{
    return this.http.post<Consolidado>(this.apiUrl,consolidado);
  }
  eliminarConsolidado(idConsolidado: number) {
    return this.http.delete(`${this.apiUrl}/${idConsolidado}`);
  }
}
