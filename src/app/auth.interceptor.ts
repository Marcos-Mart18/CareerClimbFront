import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './auth.service';
import { catchError, switchMap, throwError, of } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService); // Inyectar el servicio de autenticación
  const accessToken = authService.getAccessToken(); // Obtener el access token actual

  if (req.url.includes('/refresh') || req.url.includes('/logout')) {
    // No modificar las solicitudes al endpoint de refresh o logout
    return next(req);
  }

  if (accessToken) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return next(clonedRequest).pipe(
      catchError((error) => {
        if (error.status === 401) {
          console.warn('Token expirado. Intentando renovar...');
          return authService.refreshAccessToken().pipe(
            switchMap((newAccessToken) => {
              if (newAccessToken) {
                const newRequest = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newAccessToken}`,
                  },
                });
                return next(newRequest);
              } else {
                console.error('No se pudo renovar el token. Cerrando sesión.');
                authService.logout();
                return throwError(() => new Error('Sesión expirada. Por favor, inicie sesión nuevamente.'));
              }
            }),
            catchError(() => {
              console.error('Error al intentar renovar el token. Cerrando sesión.');
              authService.logout();
              return throwError(() => new Error('Sesión expirada. Por favor, inicie sesión nuevamente.'));
            })
          );
        }
      
        // Si no es un error 401, no cerrar sesión
        return throwError(() => error);
      })
    );      
  }

  return next(req); // Si no hay access token, continuar sin modificar
};
