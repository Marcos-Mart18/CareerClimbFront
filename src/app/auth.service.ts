import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient, private router: Router, private jwtHelper: JwtHelperService) {}

  // Método para login (actualizado)
  login(credentials: { username: string; password: string }): Observable<{ accessToken: string; refreshToken: string }> {
    return this.http.post<{ accessToken: string; refreshToken: string }>(`${this.apiUrl}/login`, credentials).pipe(
      map((response) => {
        // Guardar tokens en localStorage o sessionStorage
        this.setAccessToken(response.accessToken);
        this.setRefreshToken(response.refreshToken);
        return response;
      })
    );
  }

  // Logout (actualizado)
  logout(): void {
    const refreshToken = this.getRefreshToken(); // Obtén el refresh token
    if (!refreshToken) {
      console.error('No se encontró un refresh token para enviar al backend.');
      this.clearTokens(); // Limpia los tokens si no hay refreshToken
      this.router.navigate(['']); // Redirige al login
      return;
    }
  
    // Enviar la solicitud al backend
    this.http.post(`${this.apiUrl}/logout`, { refreshToken }).subscribe({
      next: (response) => {
        console.log('Respuesta del backend:', response);
        this.clearTokens(); // Limpia los tokens después del logout exitoso
        this.router.navigate(['']); // Redirige al login
      },
      error: (error) => {
        console.error('Error al intentar cerrar sesión:', error);
        this.clearTokens(); // Limpia los tokens incluso si ocurre un error
        this.router.navigate(['']); // Redirige al login
      },
    });
  }
  
  



  refreshAccessToken(): Observable<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      console.error('No se encontró un refresh token.');
      return of(null); // No hay refresh token
    }
  
    return this.http.post<{ accessToken: string }>(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
      map((response) => {
        const newAccessToken = response.accessToken;
        if (newAccessToken) {
          this.setAccessToken(newAccessToken); // Guardar el nuevo access token
          console.log('Nuevo access token generado:', newAccessToken);
          return newAccessToken;
        }
        return null;
      }),
      catchError((error) => {
        console.error('Error al renovar el token de acceso:', error);
        this.clearTokens(); // Limpiar tokens si ocurre un error
        return of(null); // Retornar null en caso de error
      })
    );
  }
  


  // Obtener el nombre completo de la persona desde el token
  getFullName(): string | null {
    const token = this.getAccessToken();
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
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken?.sub || null;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return token ? this.isValidToken(token) : false;
  }

  // Verificar si el token es válido
  isValidToken(token: string): boolean {
    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return !!decodedToken && !!decodedToken.roles; // Verifica que el token y los roles existan
    } catch (error) {
      console.error('Token inválido:', error);
      return false;
    }
  }

  // Extraer roles desde el token
  getRoles(): string[] {
    const token = this.getAccessToken(); // Obtén el token de localStorage
    if (!token) {
      console.error('No se encontró el token en localStorage.');
      return []; // Devuelve un arreglo vacío si no hay token
    }

    try {
      const decodedToken = this.jwtHelper.decodeToken(token); // Decodifica el token
      return decodedToken?.roles ? decodedToken.roles.split(',') : [];
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return []; // Devuelve un arreglo vacío si ocurre un error
    }
  }
  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  getRolesSinPrefijo(): string[] {
    const roles = this.getRoles();
    return roles.map((role) => (role.startsWith('ROLE_') ? role.substring(5) : role));
  }


  // Manejo de almacenamiento de tokens
  setAccessToken(token: string): void {
    sessionStorage.setItem('accessToken', token); // Guarda el accessToken en sessionStorage
  }
  setRefreshToken(token: string): void {
    localStorage.setItem('refreshToken', token); // Guarda el refreshToken en localStorage
  }
  
  getAccessToken(): string | null {
    return sessionStorage.getItem('accessToken'); // Obtén el accessToken de sessionStorage
  }
  
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken'); // Obtén el refreshToken de localStorage
  }
  

  clearTokens(): void {
    sessionStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
  
}
