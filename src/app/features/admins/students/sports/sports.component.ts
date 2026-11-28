import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Esporte } from './sports.model';
import { SportsService } from './sports.service';
import { SportIconComponent } from './sport-icon/sport-icon.component';

@Component({
    selector: 'app-sports',
    standalone: true,
    imports: [SportIconComponent],
    templateUrl: './sports.component.html',
    styleUrl: './sports.component.scss'
})
export class SportsComponent {
    private router = inject(Router);
    private service = inject(SportsService);

    esportes = this.service.listar();

    resumo(esporte: Esporte): string {
        const total = esporte.turmas.length;
        const partes = [`${total} ${total === 1 ? 'turma' : 'turmas'}`];
        const estados = esporte.turmas.map(turma => this.service.estado(turma));

        if (estados.includes('matriculada')) {
            partes.push('você já participa');
            return partes.join(' · ');
        }

        const comVaga = estados.filter(estado => estado === 'aberta').length;
        const comLista = estados.filter(estado => estado === 'cheia-lista').length;

        partes.push(comVaga ? `${comVaga} ${comVaga === 1 ? 'turma' : 'turmas'} com vaga` : 'sem vaga');

        if (comLista) {
            partes.push(`${comLista} com lista de espera`);
        }

        return partes.join(' · ');
    }

    abrir(esporte: Esporte): void {
        this.router.navigate(['/aluno/esportes', esporte.id]);
    }
}