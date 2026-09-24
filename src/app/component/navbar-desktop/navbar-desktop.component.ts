import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-navbar-desktop',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ButtonModule],
  templateUrl: './navbar-desktop.component.html',
  styleUrl: './navbar-desktop.component.scss',
})
export class NavbarDesktopComponent { }