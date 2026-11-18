import { Component, Input, OnInit } from '@angular/core';

import { Aula, AlunoDaTurma, Presenca, diaCurto, diaMes, diaPorExtenso, ehHoje }
    from '../../teacher.model';
import { TeacherService } from '../../teacher.service';

@Component({
    selector: 'app-attendance',
    imports: [],
    templateUrl: './attendance.component.html',
    styleUrl: './attendance.component.scss'
})
export class AttendanceComponent implements OnInit {

    @Input() turmaId = 0;

    /**
     * Qual aula está aberta. Guardamos o ID, não a posição na lista,
     * porque a lista muda de tamanho quando a API responde.
     * 0 = ainda não escolheu.
     */
    aulaSelecionadaId = 0;

    /**
     * O que ele marcou AGORA, nesta sessão. { 1: 'PRESENTE', 2: 'FALTA' }
     * Propriedade comum, não signal: só muda dentro de clique.
     */
    marcacoes: Record<number, Presenca> = {};

    diaCurto = diaCurto;
    diaMes = diaMes;
    diaPorExtenso = diaPorExtenso;
    ehHoje = ehHoje;

    constructor(private service: TeacherService) { }

    ngOnInit(): void {
        // Nada aqui: quem busca aulas e alunos é a tela da turma (o pai).
        // Mas a primeira aula precisa ser escolhida — ver 'aulaAtual'.
    }

    // LEITURA


    get aulas(): Aula[] { return this.service.aulasDaTurma(this.turmaId); }
    get alunos(): AlunoDaTurma[] { return this.service.alunos(); }

    /** A aula aberta. Se ele ainda não escolheu, a mais recente. */
    get aulaAtual(): Aula | undefined {
        const lista = this.aulas;
        if (lista.length === 0) { return undefined; }

        return lista.find(a => a.id === this.aulaSelecionadaId)
            ?? lista[lista.length - 1];       // ?? = se não achou, usa esta
    }

    /**
     * O estado real da chamada: o que veio do servidor, com o que ele
     * marcou agora POR CIMA.
     *
     * A ordem do spread importa: o que vem depois ganha. Por isso
     * `this.marcacoes` fica por último — a escolha de agora manda.
     */
    get marcacoesAtuais(): Record<number, Presenca> {
        const aula = this.aulaAtual;
        if (!aula) { return {}; }

        return { ...this.service.marcacoesDaAula(aula.id), ...this.marcacoes };
    }

    marcacaoDe(alunoId: number): Presenca | undefined {
        return this.marcacoesAtuais[alunoId];
    }

    // Contadores. São `get` porque recalculam sozinhos a cada repintada.
    get presentes(): number { return this.contar('PRESENTE'); }
    get faltas(): number { return this.contar('FALTA'); }
    get justificadas(): number { return this.contar('JUSTIFICADA'); }

    /** Quantos alunos ainda não foram marcados. */
    get semMarcar(): number {
        return this.alunos.filter(a => !this.marcacaoDe(a.id)).length;
    }

    private contar(presenca: Presenca): number {
        return this.alunos.filter(a => this.marcacaoDe(a.id) === presenca).length;
    }


    // AÇÕES


    selecionar(aulaId: number): void {
        this.aulaSelecionadaId = aulaId;
        this.marcacoes = {};                 // limpa o que ele marcou na outra aula
        this.service.buscarChamada(aulaId);  // e pede o que já está gravado
    }

    marcar(alunoId: number, presenca: Presenca): void {
        // Objeto NOVO, não mexer no antigo — mesma regra dos signals.
        this.marcacoes = { ...this.marcacoes, [alunoId]: presenca };
    }

    todosPresentes(): void {
        const todos: Record<number, Presenca> = {};
        for (const aluno of this.alunos) {
            todos[aluno.id] = 'PRESENTE';
        }
        this.marcacoes = todos;
    }

    salvar(): void {
        const aula = this.aulaAtual;
        if (!aula || this.semMarcar > 0) { return; }

        this.service.salvarChamada(aula.id, this.marcacoesAtuais);
        this.marcacoes = {};   // agora o servidor é a fonte da verdade
    }
}