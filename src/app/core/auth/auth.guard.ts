import { inject } from '@angular/core';
import { CanActivateFn,Router } from '@angular/router';
import { catchError,map,of } from 'rxjs';
import { AuthService } from './auth.service';
export const adminGuard:CanActivateFn=(route)=>{const auth=inject(AuthService),router=inject(Router);if(!auth.token())return router.createUrlTree(['/login']);
 return auth.me().pipe(map(u=>{const roles=route.data['roles'] as string[]|undefined;return (roles??['ADMINISTRADOR_TOTAL','ADMINISTRADOR_PARCIAL']).includes(u.perfil)?true:router.createUrlTree(['/home']);}),catchError(()=>of(router.createUrlTree(['/login']))));};
