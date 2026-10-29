import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
/** Anexa Bearer somente à API e encerra a sessão quando o servidor responde 401. */
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService),
    router = inject(Router);
  const api = request.url.startsWith(environment.apiUrl + '/');
  const publicAuth = [
    '/auth/login',
    '/auth/cadastros',
    '/auth/recuperar-senha',
    '/auth/redefinir-senha',
  ].some((path) => request.url.endsWith(path));
  const token = auth.token();
  const outbound =
    api && !publicAuth && token
      ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : request;
  return next(outbound).pipe(
    catchError((error) => {
      if (api && error.status === 401 && !request.url.endsWith('/auth/login')) {
        auth.clear();
        void router.navigate(['/login']);
      }
      return throwError(() => error);
    }),
  );
};
