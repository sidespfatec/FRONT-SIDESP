import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from './auth.service';
import { authInterceptor } from './auth.interceptor';
import { environment } from '../../../environments/environment';
describe('Integração HTTP de autenticação',()=>{
 let auth:AuthService;let http:HttpTestingController;
 beforeEach(()=>{sessionStorage.clear();TestBed.configureTestingModule({providers:[provideRouter([]),provideHttpClient(withInterceptors([authInterceptor])),provideHttpClientTesting()]});auth=TestBed.inject(AuthService);http=TestBed.inject(HttpTestingController);});
 afterEach(()=>{http.verify();auth.clear();});
 function login(){auth.login('52998224725','abcdefgh').subscribe();const r=http.expectOne(environment.apiUrl+'/auth/login');expect(r.request.method).toBe('POST');expect(r.request.headers.has('Authorization')).toBe(false);expect(r.request.body).toEqual({identificador:'52998224725',senha:'abcdefgh'});r.flush({accessToken:'token-de-teste',tokenType:'Bearer',expiresIn:1800,perfil:'ALUNO',nome:'Teste'});}
 it('envia login e guarda sessão da aba',()=>{login();expect(auth.token()).toBe('token-de-teste');expect(sessionStorage.getItem('sidesp-token')).toBe('token-de-teste');});
 it('consulta identidade com Bearer, sem confiar em perfil local',()=>{login();auth.me().subscribe();const r=http.expectOne(environment.apiUrl+'/auth/me');expect(r.request.headers.get('Authorization')).toBe('Bearer token-de-teste');r.flush({id:1,nome:'Teste',perfil:'ALUNO',dependentes:[]});expect(auth.isAdmin()).toBe(false);expect(auth.user()?.nome).toBe('Teste');});
 it('não envia token para serviços externos',()=>{login();TestBed.inject(HttpClient).get('https://example.invalid/teste').subscribe();const r=http.expectOne('https://example.invalid/teste');expect(r.request.headers.has('Authorization')).toBe(false);r.flush({});});
 it('limpa credenciais da aba ao encerrar sessão',()=>{login();auth.clear();expect(auth.token()).toBeNull();expect(sessionStorage.getItem('sidesp-token')).toBeNull();expect(auth.user()).toBeNull();});
 it('direciona aluno/responsável à home e administração ao painel',()=>{expect(auth.destination('ALUNO')).toBe('/home');expect(auth.destination('RESPONSAVEL')).toBe('/home');expect(auth.destination('ADMINISTRADOR_TOTAL')).toBe('/manage-hubs');});
});
