import { AuthService } from '../../core/auth/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { filter } from 'rxjs/operators';

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

  private allPages = [
    { path: '/manage-teachers', label: 'Cadastrar Professores' },
    { path: '/manage-admin', label: 'Gerenciar Administradores' },
    { path: '/manage-modalites', label: 'Gerenciar Modalidades' },
    { path: '/admin/alunos', label: 'Gerenciar Alunos' },
    { path: '/manage-hubs', label: 'Gerenciar Polos' },
    { path: '/admin/relatorios', label: 'Relatórios' },
    { path: '/admin/mapa-calor', label: 'Mapa de Calor' },
  ];

  /** Exibe as opções administrativas permitidas pelo perfil confirmado na API. */
  get adminPages() {
    return this.allPages.filter(
      (page) => page.path !== '/manage-admin' || this.auth.user()?.perfil === 'ADMINISTRADOR_TOTAL',
    );
  }

  /** Mantém o rótulo da navegação sem acumular inscrições ao recriar o componente. */
  constructor() {
    this.updateCurrentPage(this.router.url);
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((e: any) => this.updateCurrentPage(e.urlAfterRedirects));
  }

  /** Atualiza o nome da área a partir da rota atual. */
  private updateCurrentPage(url: string): void {
    const match = this.adminPages.find((p) => p.path && url.startsWith(p.path));
    this.currentPageLabel.set(match ? match.label : null);
  }

  /** Alterna a abertura do menu existente. */
  toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }
}
