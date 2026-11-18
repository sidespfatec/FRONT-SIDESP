import { Component } from '@angular/core';

import { TurmaDoProfessor } from '../../teacher.model';
import { TeacherService } from '../../teacher.service';

/** Um dia da semana com as turmas daquele dia. */
interface DiaDaAgenda {
    nome: string;
    turmas: TurmaDoProfessor[];
}

const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

@Component({
    selector: 'app-schedule',
    imports: [],
    templateUrl: './schedule.component.html',
    styleUrl: './schedule.component.scss'
})
export class ScheduleComponent {

    constructor(private service: TeacherService) { }

    // Sem ngOnInit: quem buscou as turmas foi a tela de perfil.
    // Repetir a busca aqui faria duas chamadas iguais à API.

    /**
     * Monta os 7 dias com as turmas de cada um.
     *
     * Uma turma de terça e quinta aparece DUAS vezes, uma em cada dia —
     * é isso que a gente quer numa agenda.
     */
    get dias(): DiaDaAgenda[] {
        const turmas = this.service.turmas();
        const resultado: DiaDaAgenda[] = [];

        // Vai de 1 a 6: segunda a sábado. Domingo (0) não tem aula.
        for (let dia = 1; dia <= 6; dia++) {

            // includes pergunta se o número está dentro do array diasSemana
            const doDia = turmas.filter(turma => turma.diasSemana.includes(dia));

            // Só entra na agenda o dia que tem alguma turma
            if (doDia.length > 0) {
                resultado.push({
                    nome: DIAS[dia],
                    // ordena pela hora. Como é texto '14:00', ordem
                    // alfabética é a mesma coisa que ordem de relógio.
                    turmas: doDia.sort((a, b) => a.horaInicio.localeCompare(b.horaInicio))
                });
            }
        }

        return resultado;
    }

    /** Soma as horas de aula da semana. */
    get horasNaSemana(): number {
        let total = 0;

        for (const turma of this.service.turmas()) {
            // '15:00' -> 15, '14:00' -> 14  (o +(...) vira número)
            const inicio = +turma.horaInicio.split(':')[0];
            const fim = +turma.horaFim.split(':')[0];

            // Uma turma de 1h que acontece 2 dias por semana = 2h
            total = total + (fim - inicio) * turma.diasSemana.length;
        }

        return total;
    }

    horaBonita(hora: string): string {
        return hora.replace(':', 'h');
    }
}