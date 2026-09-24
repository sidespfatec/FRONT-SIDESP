import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-navbar-desktop-admin',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ButtonModule],
  templateUrl: './navbar-desktop-admin.component.html',
  styleUrl: './navbar-desktop-admin.component.scss',
})
export class NavbarDesktopAdminComponent {
  isMenuOpen = signal(false);
  toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }
}