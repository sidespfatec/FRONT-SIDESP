import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError,throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
export const authInterceptor:HttpInterceptorFn=(request,next)=>{
 const auth=inject(AuthService), router=inject(Router);
 const api=request.url.startsWith(environment.apiUrl+'/');
 const publicAuth=request.url.endsWith('/auth/login')||request.url.endsWith('/auth/cadastros');
 const token=auth.token();const outbound=api&&!publicAuth&&token?request.clone({setHeaders:{Authorization:`Bearer ${token}`}}):request;
 return next(outbound).pipe(catchError(error=>{if(api&&error.status===401&&!request.url.endsWith('/auth/login')){auth.clear();void router.navigate(['/login']);}return throwError(()=>error);}));
};
