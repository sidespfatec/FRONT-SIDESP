import { Component,inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from './auth.service';
@Component({selector:'app-session',standalone:true,imports:[RouterLink],template:`<nav aria-label="Acesso à conta" class="session">@if(auth.user();as u){<span>Olá, {{u.nome}}</span><button type="button" (click)="auth.logout()">Sair</button>@if(u.dependentes.length){<p>Dependentes: @for(d of u.dependentes;track d.id){<span>{{d.nome}} </span>}</p>}}@else{<a routerLink="/login">Entrar</a><a routerLink="/registration">Cadastrar-se</a>}</nav>`,styles:[`
.session {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 0.5rem 1.5rem;
  background: var(--gray-100, #F4F4F5);
  border-bottom: 1px solid var(--gray-200, #E4E4E7);
  font-size: 0.8125rem;
  color: var(--color-text-secondary, #52525B);
}
.session p { width: 100%; margin: 0; text-align: right; }
.session a { color: var(--color-brand-primary, #0D1282); font-weight: 500; }
.session button {
  cursor: pointer;
  border: 0;
  background: none;
  padding: 0;
  font: inherit;
  font-weight: 500;
  color: var(--color-brand-primary, #0D1282);
  text-decoration: underline;
  text-underline-offset: 3px;
}
`]})
export class SessionComponent {auth=inject(AuthService);}
