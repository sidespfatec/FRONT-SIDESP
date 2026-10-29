import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';

import { AuthService } from '../../core/auth/auth.service';
import { gruposDoPerfil } from '../menu.model';

@Component({
    selector: 'app-footer',
    imports: [CommonModule, RouterLink, DrawerModule],
    standalone: true,
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss'
})
export class FooterComponent {

    auth = inject(AuthService);

    menuAberto = false;

    readonly grupos = computed(() => gruposDoPerfil(this.auth.user()?.perfil));

    readonly rotaPerfil = computed(() => this.auth.user() ? '/perfil' : '/login');

    abrirMenu() {
        this.menuAberto = true;
    }

    fecharMenu() {
        this.menuAberto = false;
    }
}
