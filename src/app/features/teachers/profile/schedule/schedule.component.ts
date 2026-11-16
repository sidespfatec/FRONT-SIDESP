import { Component, computed, input } from '@angular/core';

import { TurmaDoProfessor, duracaoEmHoras, nomeDoDia } from '../../teacher.model';

/** Uma aula dentro de um dia da agenda. */
interface BlocoDoDia {
    turma: TurmaDoProfessor;
    // Preenchido quando a aula anterior do mesmo dia e em outro polo.
    // E o que gera o aviso "troca de polo" na tela.
    poloAnterior?: string;
    fimAnterior?: string;
}

interface DiaDaAgenda {
    numero: number;
    nome: string;
    horas: number;
    blocos: BlocoDoDia[];
}

/**
 * Aba "Agenda": a semana do professor.
 *
 * Nenhum dado novo entra aqui. Tudo e derivado das turmas, porque a turma ja sabe
 * em que dias e em que horario ela acontece. Por isso 'diasSemana' e numero no model:
 * com texto ("Ter e Qui") este filtro seria impossivel.
 */
@Component({
    selector: 'app-schedule',
    imports: [],
    templateUrl: './schedule.component.html',
    styleUrl: './schedule.component.scss'
})
export class ScheduleComponent {

    readonly turmas = input.required<TurmaDoProfessor[]>();

    /** Segunda a sabado. Domingo fica de fora porque nao ha aula. */
    private readonly diasUteis = [1, 2, 3, 4, 5, 6];

    readonly semana = computed<DiaDaAgenda[]>(() =>
        this.diasUteis.map(numero => {
            const doDia = this.turmas()
                .filter(turma => turma.diasSemana.includes(numero))
                .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

            const blocos: BlocoDoDia[] = doDia.map((turma, indice) => {
                const anterior = indice > 0 ? doDia[indice - 1] : undefined;
                const mudouDePolo = anterior !== undefined && anterior.polo !== turma.polo;

                return {
                    turma,
                    poloAnterior: mudouDePolo ? anterior.polo : undefined,
                    fimAnterior: mudouDePolo ? anterior.horaFim : undefined
                };
            });

            return {
                numero,
                nome: nomeDoDia(numero),
                horas: doDia.reduce((soma, turma) => soma + duracaoEmHoras(turma.horaInicio, turma.horaFim), 0),
                blocos
            };
        })
    );

    readonly horasNaSemana = computed(() =>
        this.semana().reduce((soma, dia) => soma + dia.horas, 0)
    );

    readonly aulasNaSemana = computed(() =>
        this.semana().reduce((soma, dia) => soma + dia.blocos.length, 0)
    );

    /** Set remove repetidos: duas turmas no mesmo polo contam como um polo so. */
    readonly totalPolos = computed(() =>
        new Set(this.turmas().map(turma => turma.polo)).size
    );

    readonly totalAlunos = computed(() =>
        this.turmas().reduce((soma, turma) => soma + turma.totalAlunos, 0)
    );

    /** Tira o prefixo 'Polo ' para o aviso de troca caber na linha. */
    protected curto(polo: string): string {
        return polo.replace('Polo ', '');
    }
}
