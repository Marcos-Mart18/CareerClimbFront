import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient, private router: Router, private jwtHelper: JwtHelperService) {}

  // Método para login
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // Obtener el nombre completo de la persona desde el token
  getFullName(): string | null {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken?.nombreCompleto || null; // Extrae el campo 'nombreCompleto' del token
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }

  // Obtener el nombre de usuario
  getName(): string | null {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken?.sub || null;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  isValidToken(token: string): boolean {
    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return !!decodedToken && !!decodedToken.roles; // Verifica que el token y los roles existan
    } catch (error) {
      console.error('Token inválido:', error);
      return false;
    }
  }

  getDecodedToken(): any {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        return this.jwtHelper.decodeToken(token);
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
      }
    }
    return null;
  }

  // Extraer roles desde el token
  getRoles(): string[] {
    const token = localStorage.getItem('authToken'); // Obtén el token de localStorage
    if (!token) {
      console.error('No se encontró el token en localStorage.');
      return []; // Devuelve un arreglo vacío si no hay token
    }

    try {
      const decodedToken = this.jwtHelper.decodeToken(token); // Decodifica el token
      console.log('Token decodificado:', decodedToken);
      // Accede al campo 'roles' del payload decodificado
      return decodedToken?.roles ? decodedToken.roles.split(',') : []; 
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return []; // Devuelve un arreglo vacío si ocurre un error
    }
  }

  getRolesSinPrefijo(): string[] {
    const roles = this.getRoles();
    return roles.map((role) =>
      role.startsWith('ROLE_') ? role.substring(5) : role
    );
  }

  

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['']);
  }
}
