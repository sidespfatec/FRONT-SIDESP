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

  isMenuOpen = signal(false);
  currentPageLabel = signal<string | null>(null);

  adminPages = [
    { path: '/manage-teachers', label: 'Cadastrar Professores' },
    { path: '/manage-admin', label: 'Gerenciar Administradores' },
    { path: '/manage-modalites', label: 'Gerenciar Modalidades' },
    { path: null, label: 'Gerenciar Alunos' },
    { path: null, label: 'Relatórios' },
    { path: null, label: 'Mapa de Calor' },
  ];

  constructor() {
    this.updateCurrentPage(this.router.url);
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e: any) => this.updateCurrentPage(e.urlAfterRedirects));
  }

  private updateCurrentPage(url: string): void {
    const match = this.adminPages.find((p) => p.path && url.startsWith(p.path));
    this.currentPageLabel.set(match ? match.label : null);
  }

  toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }
}