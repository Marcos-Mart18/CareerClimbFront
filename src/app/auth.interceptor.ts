import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('authToken'); // Obtén el token del localStorage

  // Si existe el token, clona la solicitud y agrega el encabezado Authorization
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Envía la solicitud clonada con el encabezado Authorization
    return next(clonedRequest);
  }

  // Si no hay token, envía la solicitud original
  return next(req);
};
