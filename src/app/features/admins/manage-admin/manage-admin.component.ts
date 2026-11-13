import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProfessionalService } from '../professionals/services/professional.service';
import { finalize } from 'rxjs';
import { Component, inject } from '@angular/core';

import { BannerComponent } from '../../../component/banner/banner.component';
import { FooterComponent } from '../../../component/footer/footer.component';
import { NavbarDesktopAdminComponent } from '../../../component/navbar-desktop-admin/navbar-desktop-admin.component';
import { NewAdminModalComponent } from '../new-admin-modal/new-admin-modal.component';
import { Administrador, ModoFicha } from '../admin.model';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'app-manage-admin',
    imports: [
        FormsModule, BannerComponent, FooterComponent, NavbarDesktopAdminComponent, NewAdminModalComponent,
        CardModule, ButtonModule, InputTextModule, TagModule
    ],
    templateUrl: './manage-admin.component.html',
    styleUrl: './manage-admin.component.scss'
})
export class ManageAdminComponent {
    private changeDetector = inject(ChangeDetectorRef);
    showModal = false;
    modo: ModoFicha = 'ver';
    selecionado: Administrador | null = null;

    private api = inject(ProfessionalService);
    administradores: Administrador[] = [];
    search = '';
    busy = false;
    errorMessage = '';
    private router = inject(Router);
    ngOnInit() { this.load(); if (this.router.url.startsWith('/new-admin-modal')) this.abrirNovo(); }
    load() {
        this.busy = true;
        this.api.administrators().pipe(finalize(() => { this.busy = false; this.changeDetector.markForCheck(); })).subscribe({
            next: rows => this.administradores = rows.map(a => ({id: a.id, nome: a.nome,
                cpf: '', nascimento: null, email: '', telefone: '', cidade: '',
                nivel: a.perfil === 'ADMINISTRADOR_TOTAL' ? 'Administrador geral' : 'Administrador de unidade',
                cargo: a.cargo || '', unidade: a.unidade || '', admissao: a.admissao ? new Date(a.admissao) : null,
                doisFatores: false, ativo: a.ativo})),
            error: e => this.errorMessage = e.error?.mensagem || 'Não foi possível carregar os administradores.'
        });
    }
    get filteredAdmins() {
        return this.administradores.filter(a => a.nome.toLocaleLowerCase('pt-BR').includes(this.search.trim().toLocaleLowerCase('pt-BR')));
    }
    abrirNovo() { this.selecionado = null; this.modo = 'novo'; this.showModal = true; }
    abrirFicha(admin: Administrador) { this.selecionado = admin; this.modo = 'ver'; this.showModal = true; }
    salvar() { this.showModal = false; this.load(); }
    alternarSituacao(admin: Administrador) {
        if (this.busy || !admin) return;
        this.busy = true;
        this.api.status('administradores', admin.id, !admin.ativo).pipe(finalize(() => { this.busy = false; this.changeDetector.markForCheck(); })).subscribe({
            next: () => { this.showModal = false; this.load(); },
            error: e => this.errorMessage = e.error?.mensagem || 'Não foi possível alterar a situação.'
        });
    }
}
