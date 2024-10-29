import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  const token = authService.getToken();
  
  const authReq = req.clone({
    setHeaders: {
      Authorization: `bearer ${token}`
    }
  });

  return next(authReq).pipe(catchError( error => {

    if(error.status == 401 && error.url != `${environment}Auth`){
      // Attempt to refresh the token
      return from(authService.refreshToken()).pipe(
        switchMap(() => {
          const newToken = authService.getToken();
          if (newToken) {
            // Clone the failed request with the new token
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`
              }
            });
            return next(retryReq);
          }
          // If there's no new token, logout the user
          //authService.logout();
          return throwError(() => error);
        }),
        catchError((refreshError) => {
          // If refresh token also fails, logout the user
          //authService.logout();
          return throwError(() => refreshError);
        })
      );
    }
    // For other errors, propagate the error
    return throwError(() => error);
  }));
};
