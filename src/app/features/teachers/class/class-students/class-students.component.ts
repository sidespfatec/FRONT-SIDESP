import { Component } from '@angular/core';

import { AlunoDaTurma } from '../../teacher.model';
import { TeacherService } from '../../teacher.service';

@Component({
    selector: 'app-class-students',
    imports: [],
    templateUrl: './class-students.component.html',
    styleUrl: './class-students.component.scss'
})
export class ClassStudentsComponent {

    /** Qual aluno está aberto. 0 = nenhum. */
    abertoId = 0;

    constructor(private service: TeacherService) { }

    get alunos(): AlunoDaTurma[] { return this.service.alunos(); }

    get frequenciaMedia(): number {
        const lista = this.alunos;
        if (lista.length === 0) { return 0; }   // dividir por zero daria NaN

        const soma = lista.reduce((total, a) => total + a.frequencia, 0);
        return Math.round(soma / lista.length);
    }

    /** Abre o aluno, ou fecha se já estava aberto. */
    alternar(alunoId: number): void {
        this.abertoId = this.abertoId === alunoId ? 0 : alunoId;
    }

    /** 'tel:' abre o discador do celular já com o número. */
    linkTelefone(telefone: string): string {
        // \D = tudo que NÃO é dígito. O 'g' troca todas as ocorrências.
        return `tel:+55${telefone.replace(/\D/g, '')}`;
    }
}