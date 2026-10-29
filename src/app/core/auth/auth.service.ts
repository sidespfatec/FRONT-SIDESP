import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Registration,LoginResult,Me } from './auth.models';
@Injectable({providedIn:'root'})
export class AuthService {
 private http=inject(HttpClient);private router=inject(Router);private browser=isPlatformBrowser(inject(PLATFORM_ID));
 private storedToken=signal<string|null>(null);user=signal<Me|null>(null);
 constructor(){if(this.browser){try{this.storedToken.set(sessionStorage.getItem('sidesp-token'));}catch{}}}
 token(){return this.storedToken();}
 register(body:Registration){return this.http.post<{id:number;mensagem:string}>(`${environment.apiUrl}/auth/cadastros`,body);}
 login(identificador:string,senha:string){return this.http.post<LoginResult>(`${environment.apiUrl}/auth/login`,{identificador,senha}).pipe(tap(r=>{this.storedToken.set(r.accessToken);if(this.browser){try{sessionStorage.setItem('sidesp-token',r.accessToken);}catch{}}}));}
 me(){return this.http.get<Me>(`${environment.apiUrl}/auth/me`).pipe(tap(u=>this.user.set(u)));}
 isAdmin(){return this.user()?.perfil==='ADMINISTRADOR_TOTAL'||this.user()?.perfil==='ADMINISTRADOR_PARCIAL';}
 clear(){this.storedToken.set(null);this.user.set(null);if(this.browser){try{sessionStorage.removeItem('sidesp-token');}catch{}}}
 logout(){this.clear();void this.router.navigate(['/login']);}
 destination(perfil:string){return perfil==='ADMINISTRADOR_TOTAL'||perfil==='ADMINISTRADOR_PARCIAL'?'/manage-hubs':'/home';}
}
