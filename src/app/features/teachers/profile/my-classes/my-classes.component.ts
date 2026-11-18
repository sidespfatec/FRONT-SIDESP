import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TurmaDoProfessor, rotuloDias } from '../../teacher.model';
import { TeacherService } from '../../teacher.service';

@Component({
    selector: 'app-my-classes',
    // RouterLink precisa estar aqui para o template poder usar routerLink.
    imports: [RouterLink],
    templateUrl: './my-classes.component.html',
    styleUrl: './my-classes.component.scss'
})
export class MyClassesComponent implements OnInit {

    // O template só enxerga o que é propriedade da classe, não o que está
    // importado no arquivo. Por isso esta linha: ela dá ao HTML acesso à
    // função do model.
    rotuloDias = rotuloDias;

    constructor(private service: TeacherService) { }

    ngOnInit(): void {
        this.service.buscarTurmas();
    }

    get turmas(): TurmaDoProfessor[] { return this.service.turmas(); }
    get carregando() { return this.service.carregando(); }
    get erro() { return this.service.erro(); }

    /** Soma os alunos de todas as turmas. */
    get totalAlunos(): number {
        // reduce percorre somando. O 0 no final é por onde a soma começa.
        return this.turmas.reduce((soma, turma) => soma + turma.totalAlunos, 0);
    }

    /** '14:00' -> '14h00' */
    horaBonita(hora: string): string {
        return hora.replace(':', 'h');
    }
}