import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './auth.service';
import { catchError, switchMap, throwError, of } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService); // Inyectar el servicio de autenticación
  const accessToken = authService.getAccessToken(); // Obtener el token actual

  // Excluir solicitudes a /refresh y /logout del interceptor
  if (req.url.includes('/refresh') || req.url.includes('/logout')) {
    return next(req);
  }

  // Si hay un access token, clonamos la solicitud para agregar el Authorization header
  if (accessToken) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return next(clonedRequest).pipe(
      // Manejar errores de la solicitud
      catchError((error) => {
        // Si el token ha expirado (401), intentar renovar el token
        if (error.status === 401) {
          console.warn('Token expirado. Intentando renovar...');

          return authService.refreshAccessToken().pipe(
            switchMap((newAccessToken) => {
              if (newAccessToken) {
                console.info('Token renovado exitosamente.');
                // Clonar nuevamente la solicitud con el nuevo token
                const newRequest = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newAccessToken}`,
                  },
                });
                return next(newRequest);
              } else {
                console.error('No se pudo renovar el token. Cerrando sesión.');
                authService.logout();
                return throwError(
                  () =>
                    new Error(
                      'Sesión expirada. Por favor, inicie sesión nuevamente.'
                    )
                );
              }
            }),
            // Si ocurre un error al intentar renovar el token
            catchError(() => {
              console.error(
                'Error al intentar renovar el token. Cerrando sesión.'
              );
              authService.logout();
              return throwError(
                () =>
                  new Error(
                    'Sesión expirada. Por favor, inicie sesión nuevamente.'
                  )
              );
            })
          );
        }

        // Si no es un error 401, propagar el error
        return throwError(() => error);
      })
    );
  }

  // Si no hay un token, continuar sin modificar la solicitud
  return next(req);
};
