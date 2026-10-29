import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { ChipModule } from 'primeng/chip';
import { DatePickerModule } from 'primeng/datepicker';
import { IftaLabelModule } from 'primeng/iftalabel';
import { MultiSelectModule } from 'primeng/multiselect';
import { PopoverModule } from 'primeng/popover';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SliderModule } from 'primeng/slider';

import { BannerComponent } from '../../../component/banner/banner.component';
import { FooterComponent } from '../../../component/footer/footer.component';
import { NavbarDesktopAdminComponent } from '../../../component/navbar-desktop-admin/navbar-desktop-admin.component';

import {
    COMPARAR_POR, DADOS, Eixo, GENERO_OPCOES, MAIORES_FALTAS, MODALIDADES_OPCOES,
    NOTAS, POLOS_OPCOES, SEPARAR_POR, Serie, SITUACAO_OPCOES, TITULOS
} from '../heat-map.model';

const AZUL = '#0D1282';
const AZUL_CLARO = '#767AC7';
const VERMELHO = '#E62727';
const TINTA = '#52525B';
const GRADE = '#E4E4E7';

@Component({
    selector: 'app-heat-map',
    standalone: true,
    imports: [
        CommonModule, FormsModule,
        BannerComponent, FooterComponent, NavbarDesktopAdminComponent,
        ButtonModule, ChartModule, ChipModule, DatePickerModule,
        IftaLabelModule, MultiSelectModule, PopoverModule, SelectButtonModule, SliderModule
    ],
    templateUrl: './heat-map.component.html',
    styleUrl: './heat-map.component.scss'
})
export class HeatMapComponent {

    readonly compararPor = COMPARAR_POR;
    readonly separarPor = SEPARAR_POR;
    readonly polosOpcoes = POLOS_OPCOES;
    readonly modalidadesOpcoes = MODALIDADES_OPCOES;
    readonly generoOpcoes = GENERO_OPCOES;
    readonly situacaoOpcoes = SITUACAO_OPCOES;
    readonly maioresFaltas = MAIORES_FALTAS;

    periodo: Date[] = [new Date(2026, 0, 1), new Date(2026, 11, 1)];
    polosSelecionados: string[] = ['Pedregulho', 'Centro'];
    modalidadesSelecionadas: string[] = [];
    genero = 'todos';
    situacao = 'ativas';
    faixaEtaria: number[] = [10, 14];

    eixo = signal<Eixo>('mes');
    serie = signal<Serie>('nenhum');

    readonly titulo = computed(() => TITULOS[this.eixo()]);
    readonly nota = computed(() => NOTAS[this.eixo()]);

    readonly filtrosAtivos = computed(() => {
        const lista: string[] = [];
        if (this.polosSelecionados.length) { lista.push(this.polosSelecionados.join(', ')); }
        if (this.modalidadesSelecionadas.length) { lista.push(this.modalidadesSelecionadas.join(', ')); }
        if (this.genero !== 'todos') { lista.push(this.genero); }
        if (this.situacao === 'ativas') { lista.push('só turmas ativas'); }
        lista.push(`${this.faixaEtaria[0]} a ${this.faixaEtaria[1]} anos`);
        return lista;
    });

    readonly dadosGrafico = computed(() => {
        const d = DADOS[this.eixo()];
        const dupla = this.serie() === 'genero';

        const indices = d.rotulos.map((_, i) => i);
        if (d.ordenar) { indices.sort((a, b) => d.total[b] - d.total[a]); }

        const datasets = dupla
            ? [
                { label: 'meninas', data: indices.map(i => d.meninas[i]), backgroundColor: AZUL, borderRadius: 3, maxBarThickness: 22 },
                { label: 'meninos', data: indices.map(i => d.meninos[i]), backgroundColor: AZUL_CLARO, borderRadius: 3, maxBarThickness: 22 }
            ]
            : [
                { label: 'inscritos', data: indices.map(i => d.total[i]), backgroundColor: AZUL, borderRadius: 3, maxBarThickness: 34 }
            ];

        return { labels: indices.map(i => d.rotulos[i]), datasets };
    });

    readonly opcoesGrafico = computed(() =>
        this.montarOpcoes(DADOS[this.eixo()].horizontal, this.serie() === 'genero')
    );

    readonly dadosFaltas = {
        labels: MAIORES_FALTAS.map(f => f.nome),
        datasets: [{
            label: '% de faltas',
            data: MAIORES_FALTAS.map(f => f.percentual),
            backgroundColor: VERMELHO,
            borderRadius: 3,
            maxBarThickness: 18
        }]
    };

    readonly opcoesFaltas = this.montarOpcoes(true, false);

    private montarOpcoes(horizontal: boolean, legenda: boolean) {
        return {
            indexAxis: horizontal ? 'y' : 'x',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: legenda,
                    position: 'top',
                    align: 'start',
                    labels: { boxWidth: 12, boxHeight: 12, color: TINTA, font: { size: 12 } }
                },
                tooltip: { backgroundColor: '#3F3F46', padding: 10, cornerRadius: 6 }
            },
            scales: {
                x: {
                    grid: { display: horizontal, color: GRADE },
                    border: { display: false },
                    ticks: { color: TINTA, font: { size: 11 } }
                },
                y: {
                    grid: { display: !horizontal, color: GRADE },
                    border: { display: false },
                    ticks: { color: TINTA, font: { size: 11 } },
                    beginAtZero: true
                }
            }
        };
    }

    removerFiltro(filtro: string): void {
        if (this.polosSelecionados.join(', ') === filtro) { this.polosSelecionados = []; return; }
        if (this.modalidadesSelecionadas.join(', ') === filtro) { this.modalidadesSelecionadas = []; return; }
        if (this.genero === filtro) { this.genero = 'todos'; return; }
        if (filtro === 'só turmas ativas') { this.situacao = 'todas'; return; }
        this.faixaEtaria = [6, 30];
    }

    limparTudo(): void {
        this.polosSelecionados = [];
        this.modalidadesSelecionadas = [];
        this.genero = 'todos';
        this.situacao = 'todas';
        this.faixaEtaria = [6, 30];
    }
}
