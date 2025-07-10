import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  const token = authService.getToken();

  if (req.url.includes('/api/auth/login') || req.url.includes('/api/auth/register')) {
    return next(req);
  }

  if (token && authService.isTokenExpired()) {
    console.warn('Token scaduto ');
    authService.logout();
    return new Observable(() => {});
  }

  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` }}) : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        authService.logout()
      }
      return throwError(() => err);
    })
  );
};
