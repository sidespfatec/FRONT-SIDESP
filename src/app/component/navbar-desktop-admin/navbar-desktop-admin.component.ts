import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { filter } from 'rxjs/operators';

import { AuthService } from '../../core/auth/auth.service';
import { itensDoPerfil } from '../menu.model';

@Component({
  selector: 'app-navbar-desktop-admin',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ButtonModule],
  templateUrl: './navbar-desktop-admin.component.html',
  styleUrl: './navbar-desktop-admin.component.scss',
})
export class NavbarDesktopAdminComponent {
  private router = inject(Router);
  auth = inject(AuthService);

  isMenuOpen = signal(false);
  currentPageLabel = signal<string | null>(null);

  readonly adminPages = computed(() =>
    itensDoPerfil(this.auth.user()?.perfil).map(item => ({ path: item.rota, label: item.nome }))
  );

  constructor() {
    this.updateCurrentPage(this.router.url);
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e: any) => this.updateCurrentPage(e.urlAfterRedirects));
  }

  toggleMenu(): void {
    this.isMenuOpen.update((aberto) => !aberto);
  }

  fecharMenu(): void {
    this.isMenuOpen.set(false);
  }

  sair(): void {
    this.fecharMenu();
    this.auth.logout();
  }

  private updateCurrentPage(url: string): void {
    const pagina = this.adminPages().find((p) => p.path && url.startsWith(p.path));
    this.currentPageLabel.set(pagina ? pagina.label : null);
  }
}
