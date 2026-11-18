import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { filter } from 'rxjs/operators';

import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-navbar-desktop-admin',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ButtonModule],
  templateUrl: './navbar-desktop-admin.component.html',
  styleUrl: './navbar-desktop-admin.component.scss',
})
export class NavbarDesktopAdminComponent {
  private router = inject(Router);
  private auth = inject(AuthService);

  isMenuOpen = signal(false);
  currentPageLabel = signal<string | null>(null);

  adminPages = [
    { path: '/manage-teachers', label: 'Cadastrar Professores' },
    { path: '/manage-admin', label: 'Gerenciar Administradores' },
    { path: '/manage-modalites', label: 'Gerenciar Modalidades' },
    { path: '/admin/alunos', label: 'Gerenciar Alunos' },
    { path: '/manage-hubs', label: 'Gerenciar Polos' },
    { path: '/admin/relatorios', label: 'Relatórios' },
    { path: '/admin/mapa-calor', label: 'Mapa de Calor' },
  ];

  constructor() {
    this.updateCurrentPage(this.router.url);
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.updateCurrentPage(e.urlAfterRedirects);
        // Fecha o submenu ao trocar de tela, senão ele fica aberto por cima
        // da página nova no celular.
        this.isMenuOpen.set(false);
      });
  }

  // ------------------------------------------------------------------
  // QUEM ESTÁ LOGADO
  // ------------------------------------------------------------------
  // São `get` lendo signals do AuthService: quando o login acontece, o menu
  // se redesenha sozinho, sem ninguém avisar ninguém.

  /** Deslogado: a navbar mostra só INICIAL, ESPORTES e o botão de entrar. */
  get estaLogado(): boolean {
    return this.auth.estaLogado;
  }

  /** Só o administrador vê o menu sanduíche com as telas de gestão. */
  get ehAdministrador(): boolean {
    return this.auth.ehAdministrador;
  }

  /** Endereço do perfil de quem está logado, ou null se o perfil não tem tela. */
  get rotaPerfil(): string | null {
    return this.auth.rotaPerfil();
  }

  /** 'Ricardo Alves de Campos' -> 'Ricardo' */
  get primeiroNome(): string {
    return this.auth.nome().split(' ')[0];
  }

  sair(): void {
    this.auth.sair();
    this.router.navigateByUrl('/home');
  }

  toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  private updateCurrentPage(url: string): void {
    const match = this.adminPages.find((p) => p.path && url.startsWith(p.path));
    this.currentPageLabel.set(match ? match.label : null);
  }
}
