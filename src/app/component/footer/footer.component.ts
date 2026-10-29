import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { NavigationEnd, NavigationSkipped, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import { DrawerModule } from 'primeng/drawer';

@Component({
    selector: 'app-footer',
    imports: [CommonModule, RouterLink, DrawerModule],
    standalone: true,
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss'
})
export class FooterComponent {
    private router = inject(Router);

    menuAberto = false;

    constructor() {
        this.router.events
            .pipe(
                filter(evento => evento instanceof NavigationEnd || evento instanceof NavigationSkipped),
                takeUntilDestroyed()
            )
            .subscribe(() => this.fecharMenu());
    }

    grupos = [
        {
            titulo: 'Cadastros',
            itens: [
                { icone: 'pi pi-map-marker', nome: 'Polos', rota: '/manage-hubs' },
                { icone: 'pi pi-user-plus', nome: 'Professores', rota: '/manage-teachers' },
                { icone: 'pi pi-list', nome: 'Modalidades', rota: '/manage-modalites' }
            ]
        },
        {
            titulo: 'Gestão',
            itens: [
                { icone: 'pi pi-users', nome: 'Alunos', rota: '/admin/alunos' },
                { icone: 'pi pi-shield', nome: 'Administradores', rota: '/manage-admin' }
            ]
        },
        {
            titulo: 'Análise',
            itens: [
                { icone: 'pi pi-chart-bar', nome: 'Relatórios', rota: '/admin/relatorios' },
                { icone: 'pi pi-map', nome: 'Mapa de Calor', rota: '/admin/mapa-calor' }
            ]
        }
    ];

    abrirMenu() {
        this.menuAberto = true;
    }

    fecharMenu() {
        this.menuAberto = false;
    }
}