import { Component } from '@angular/core';

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
        BannerComponent, FooterComponent, NavbarDesktopAdminComponent, NewAdminModalComponent,
        CardModule, ButtonModule, InputTextModule, TagModule
    ],
    templateUrl: './manage-admin.component.html',
    styleUrl: './manage-admin.component.scss'
})
export class ManageAdminComponent {
    showModal = false;
    modo: ModoFicha = 'ver';
    selecionado: Administrador | null = null;

    administradores: Administrador[] = [
        {
            id: 1, nome: 'Ana Martins', cpf: '111.222.333-44', rg: '12.345.678-9',
            nascimento: new Date(1988, 3, 12), email: 'ana.martins@exemplo.br',
            telefone: '(12) 99000-0001', cidade: 'Guaratinguetá', nivel: 'Administrador geral',
            cargo: 'Coordenadora de esportes', unidade: 'Sede', admissao: new Date(2021, 1, 1),
            doisFatores: true, ativo: true, cadastradoPor: 'Lívia Andrade'
        },
        {
            id: 2, nome: 'Carlos Souza', cpf: '222.333.444-55', rg: '23.456.789-0',
            nascimento: new Date(1990, 8, 3), email: 'carlos.souza@exemplo.br',
            telefone: '(12) 99000-0002', cidade: 'Guaratinguetá', nivel: 'Administrador de unidade',
            cargo: 'Gestor de polo', unidade: 'Polo Pedregulho', admissao: new Date(2022, 4, 16),
            doisFatores: true, ativo: true, cadastradoPor: 'Lívia Andrade'
        },
        {
            id: 3, nome: 'Débora Nogueira', cpf: '333.444.555-66', rg: '34.567.890-1',
            nascimento: new Date(1995, 0, 27), email: 'debora.nogueira@exemplo.br',
            telefone: '(12) 99000-0003', cidade: 'Guaratinguetá', nivel: 'Somente leitura',
            cargo: 'Assessoria de imprensa', unidade: 'Sede', admissao: new Date(2024, 2, 4),
            doisFatores: false, ativo: true, cadastradoPor: 'Ana Martins'
        },
        {
            id: 4, nome: 'Juliana Prado', cpf: '444.555.666-77', rg: '45.678.901-2',
            nascimento: new Date(1993, 6, 19), email: 'juliana.prado@exemplo.br',
            telefone: '(12) 99000-0004', cidade: 'Aparecida', nivel: 'Operador',
            cargo: 'Secretaria de matrículas', unidade: 'Sede', admissao: new Date(2023, 7, 21),
            doisFatores: true, ativo: true, cadastradoPor: 'Ana Martins'
        },
        {
            id: 5, nome: 'Marcelo Tavares', cpf: '555.666.777-88', rg: '56.789.012-3',
            nascimento: new Date(1986, 10, 30), email: 'marcelo.tavares@exemplo.br',
            telefone: '(12) 99000-0005', cidade: 'Guaratinguetá', nivel: 'Operador',
            cargo: 'Apoio administrativo', unidade: 'Polo Campo do Galvão', admissao: new Date(2020, 9, 5),
            doisFatores: true, ativo: true, cadastradoPor: 'Lívia Andrade'
        },
        {
            id: 6, nome: 'Fábio Ramos', cpf: '666.777.888-99', rg: '67.890.123-4',
            nascimento: new Date(2001, 5, 8), email: 'fabio.ramos@exemplo.br',
            telefone: '(12) 99000-0006', cidade: 'Lorena', nivel: 'Somente leitura',
            cargo: 'Estagiário de comunicação', unidade: 'Sede', admissao: new Date(2025, 0, 13),
            doisFatores: false, ativo: false, cadastradoPor: 'Lívia Andrade'
        }
    ];

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
        if (this.modo === 'novo') {
            const id = Math.max(0, ...this.administradores.map(a => a.id)) + 1;
            this.administradores = [{ ...dados, id, ativo: true }, ...this.administradores];
        } else {
            this.administradores = this.administradores.map(a =>
                a.id === dados.id ? dados : a
            );
        }
        this.showModal = false;
    }

    alternarSituacao(admin: Administrador) {
        this.administradores = this.administradores.map(a =>
            a.id === admin.id ? { ...a, ativo: !a.ativo } : a
        );
        this.showModal = false;
    }
}