import { Component,inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from './auth.service';
@Component({selector:'app-session',standalone:true,imports:[RouterLink],template:`<nav aria-label="Acesso à conta" class="session">@if(auth.user();as u){<span>Olá, {{u.nome}}</span><button type="button" (click)="auth.logout()">Sair</button>@if(u.dependentes.length){<p>Dependentes: @for(d of u.dependentes;track d.id){<span>{{d.nome}} </span>}</p>}}@else{<a routerLink="/login">Entrar</a><a routerLink="/registration">Cadastrar-se</a>}</nav>`,styles:[`.session { padding:1rem; display:flex; gap:1rem; flex-wrap:wrap; background:#fff; color:#0d1282; } .session p{width:100%;margin:0} button{cursor:pointer}`]})
export class SessionComponent {auth=inject(AuthService);}
