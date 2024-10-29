import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((err) => {
      const error = err;

      switch (err.status) {
        case 0:
          error.message = `No se pudo conectar con el servidor`;
          break;
        case 400:
          error.message = `Solicitud no válida`;
          break;
        case 401:
          error.message = `No autorizado`;
          break;
        case 403:
          error.message = `Acceso prohibido`;
          break;
        case 404:
          error.message = `Recurso no encontrado`;
          break;
        case 408:
          error.message = `Tiempo de espera de solicitud agotado`;
          break;
        case 415:
          error.message = `Tipo de medio no admitido`;
          break;
        case 500:
          error.message = `Error interno del servidor`;
          break;
        case 502:
          error.message = `Puerta de enlace incorrecta`;
          break;
        case 503:
          error.message = `Servicio no disponible`;
          break;
        case 504:
          error.message = `Tiempo de espera de puerta de enlace agotado`;
          break;
        default:
          error.message = `Error desconocido: ${err.status}`;
          break;
      }

      if(error.url == `${environment.api}Auth` && error.status != 0) { error.message = 'Correo o contraseña incorrectos' }

      if(error.status == 403){
        router.navigate(['dashboard']);
      }

      return throwError(() => err);
    })
  );
};
