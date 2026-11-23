import { Component, inject, OnInit } from '@angular/core';

import { NewAdminModalComponent } from '../new-admin-modal/new-admin-modal.component';
import { Administrador, ModoFicha } from '../admin.model';
import { AdministradorDaLista } from '../admin-management.model';
import { AdminManagementService } from '../admin-management.service';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
    selector: 'app-manage-admin',
    imports: [
        NewAdminModalComponent,
        CardModule, ButtonModule, InputTextModule, FormsModule, SelectButtonModule
    ],
    templateUrl: './manage-admin.component.html',
    styleUrl: './manage-admin.component.scss'
})
export class ManageAdminComponent implements OnInit {

    private readonly service = inject(AdminManagementService);

    readonly carregando = this.service.carregando;
    readonly erro = this.service.erro;

    showModal = false;
    modo: ModoFicha = 'ver';
    selecionado: Administrador | null = null;

    busca = '';
    filtro = 'ativos';

    opcoesFiltro = [
        { label: 'Ativos', value: 'ativos' },
        { label: 'Inativos', value: 'inativos' }
    ];

    ngOnInit(): void {
        this.service.buscarAdministradores();
    }

    get administradores(): Administrador[] {
        return this.service.administradores().map(a => this.paraFicha(a));
    }

    get administradoresFiltrados(): Administrador[] {
        const texto = this.busca.toLowerCase();
        return this.administradores.filter(admin =>
            admin.ativo === (this.filtro === 'ativos') &&
            admin.nome.toLowerCase().includes(texto)
        );
    }

    /** O GET traz só o que a listagem mostra; o resto da ficha fica vazio. */
    private paraFicha(a: AdministradorDaLista): Administrador {
        return {
            id: a.id,
            nome: a.nome,
            cpf: '',
            rg: '',
            nascimento: null,
            email: '',
            telefone: '',
            cidade: '',
            nivel: a.perfil === 'ADMINISTRADOR_TOTAL' ? 'Acesso total' : 'Acesso parcial',
            cargo: a.cargo ?? '',
            unidade: a.unidade ?? '',
            admissao: null,
            doisFatores: false,
            ativo: a.ativo
        };
    }

    recarregar() {
        this.service.buscarAdministradores();
    }

    iniciais(nome: string) {
        const palavras = nome.trim().split(' ');
        return (palavras[0][0] + (palavras.length > 1 ? palavras[palavras.length - 1][0] : '')).toUpperCase();
    }

    abrirNovo() {
        this.selecionado = null;
        this.modo = 'novo';
        this.showModal = true;
    }

    abrirFicha(admin: Administrador) {
        this.selecionado = admin;
        this.modo = 'ver';
        this.showModal = true;
    }

    salvar(dados: Administrador) {
        this.showModal = false;
    }

    alternarSituacao(admin: Administrador) {
        this.showModal = false;
        this.service.alterarSituacao(admin.id, !admin.ativo).subscribe({
            next: () => this.recarregar(),
            error: () => this.recarregar()
        });
    }
}
