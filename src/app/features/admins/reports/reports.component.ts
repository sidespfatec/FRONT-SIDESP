import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

import { BannerComponent } from '../../../component/banner/banner.component';
import { FooterComponent } from '../../../component/footer/footer.component';
import { NavbarDesktopAdminComponent } from '../../../component/navbar-desktop-admin/navbar-desktop-admin.component';

import {
    EXPORTACOES_RECENTES, ExportacaoRecente, POLOS_OPCOES, RELATORIOS, Relatorio, TURMAS_OPCOES
} from '../reports.model';

@Component({
    selector: 'app-reports',
    standalone: true,
    imports: [
        CommonModule, FormsModule,
        BannerComponent, FooterComponent, NavbarDesktopAdminComponent,
        ButtonModule, DatePickerModule, DialogModule, MultiSelectModule,
        TableModule, TagModule, ToastModule
    ],
    providers: [MessageService],
    templateUrl: './reports.component.html',
    styleUrl: './reports.component.scss'
})
export class ReportsComponent {

    readonly relatorios = RELATORIOS;
    readonly turmasOpcoes = TURMAS_OPCOES;
    readonly polosOpcoes = POLOS_OPCOES;

    exportacoes: ExportacaoRecente[] = EXPORTACOES_RECENTES;

    aberto = signal(false);
    escolhido = signal<Relatorio | null>(null);

    turmasSelecionadas: string[] = [];
    polosSelecionados: string[] = [];
    periodo: Date = new Date();

    constructor(private messageService: MessageService) { }

    abrir(relatorio: Relatorio): void {
        this.escolhido.set(relatorio);
        this.turmasSelecionadas = [];
        this.polosSelecionados = [];
        this.periodo = new Date();
        this.aberto.set(true);
    }

    fechar(): void {
        this.aberto.set(false);
    }

    exportar(): void {
        const relatorio = this.escolhido();
        if (!relatorio) { return; }

        this.aberto.set(false);
        this.messageService.add({
            severity: 'success',
            summary: 'Exportação iniciada',
            detail: `${relatorio.nome} em .xls`,
            life: 4000
        });
    }

    baixar(exportacao: ExportacaoRecente): void {
        this.messageService.add({
            severity: 'info',
            summary: 'Download',
            detail: exportacao.relatorio,
            life: 3000
        });
    }
}
