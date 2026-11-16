import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { BannerComponent } from './component/banner/banner.component';
import { FooterComponent } from './component/footer/footer.component';
import { NavbarDesktopAdminComponent } from './component/navbar-desktop-admin/navbar-desktop-admin.component';

/** Rotas que nao exibem navbar nem footer. */
const SEM_NAVEGACAO = ['/login', '/registration'];

/** Rotas que tambem nao exibem o banner. */
const SEM_BANNER = ['/registration'];

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, NavbarDesktopAdminComponent, BannerComponent, FooterComponent],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {

    protected readonly title = signal('SIDESP');

    private readonly router = inject(Router);

    /** Rota atual. Comeca com a URL de entrada e acompanha cada navegacao. */
    private readonly rotaAtual = signal(this.router.url);

    constructor() {
        this.router.events
            .pipe(
                filter(evento => evento instanceof NavigationEnd),
                takeUntilDestroyed()
            )
            // urlAfterRedirects e a rota final: se houve redirecionamento,
            // e ela que vale, nao a que foi pedida.
            .subscribe(evento => this.rotaAtual.set(evento.urlAfterRedirects));
    }

    readonly mostrarNavegacao = computed(() => !this.combina(SEM_NAVEGACAO));

    readonly mostrarBanner = computed(() => !this.combina(SEM_BANNER));

    private combina(rotas: string[]): boolean {
        const atual = this.rotaAtual();
        return rotas.some(rota => atual === rota || atual.startsWith(`${rota}/`));
    }
}
