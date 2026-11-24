import { AfterViewInit, Component, ElementRef, OnInit, computed, inject, input, signal, viewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import {
    Aula, Presenca, MOTIVOS_CANCELAMENTO, ROTULO_SITUACAO,
    diaCurto, diaMes, diaPorExtenso, ehFuturo, ehHoje, mesAno
} from '../../teacher.model';
import { TeacherService } from '../../teacher.service';

/**
 * Aba "Chamada".
 *
 * A ideia da tela: o professor faz isso de pe, na beira da piscina. Entao
 * "Todos presentes" resolve a maioria num toque e ele so vira as excecoes,
 * e o botao de salvar fica travado enquanto faltar alguem -- chamada pela
 * metade viraria buraco no calendario de frequencia do aluno.
 */
@Component({
    selector: 'app-attendance',
    imports: [ButtonModule, DrawerModule, ToastModule],
    providers: [MessageService],
    templateUrl: './attendance.component.html',
    styleUrl: './attendance.component.scss'
})
export class AttendanceComponent implements OnInit, AfterViewInit {

    readonly turmaId = input.required<number>();

    private readonly service = inject(TeacherService);
    private readonly mensagens = inject(MessageService);

    // Referencia da tira de chips, usada para centralizar a aula selecionada.
    private readonly tira = viewChild<ElementRef<HTMLElement>>('tira');

    // Como aulasDaTurma() le um signal la dentro, este computed refaz sozinho
    // quando uma aula muda de situacao.
    readonly aulas = computed(() => this.service.aulasDaTurma(this.turmaId()));

    readonly alunos = computed(() => this.service.alunosDaTurma(this.turmaId()));

    /** Guardamos o id, nao o indice: a lista pode mudar de tamanho. */
    readonly aulaSelecionadaId = signal<number | null>(null);

    readonly aulaAtual = computed<Aula | undefined>(() => {
        const lista = this.aulas();
        const id = this.aulaSelecionadaId();
        return lista.find(aula => aula.id === id) ?? lista[lista.length - 1];
    });

    /** Marcacoes em edicao. So vao para o service quando ele salva. */
    readonly marcacoes = signal<Record<number, Presenca>>({});

    readonly presentes = computed(() => this.contar('PRESENTE'));
    readonly faltas = computed(() => this.contar('FALTA'));
    readonly justificadas = computed(() => this.contar('JUSTIFICADA'));

    readonly semMarcar = computed(() =>
        this.alunos().length - this.presentes() - this.faltas() - this.justificadas()
    );

    readonly jaSalva = computed(() => this.aulaAtual()?.situacao === 'SALVA');

    readonly cancelada = computed(() => this.aulaAtual()?.situacao === 'CANCELADA');

    /**
     * Aulas que ja aconteceram e continuam sem chamada.
     * E o aviso mais importante da tela: sem ele, um dia esquecido nunca mais
     * seria preenchido.
     */
    readonly atrasadas = computed(() =>
        this.aulas().filter(aula =>
            aula.situacao === 'PENDENTE' && !ehHoje(aula.data) && !ehFuturo(aula.data)
        )
    );

    readonly listaAberta = signal(false);
    readonly motivosAbertos = signal(false);

    protected readonly motivos = MOTIVOS_CANCELAMENTO;
    protected readonly rotuloSituacao = ROTULO_SITUACAO;
    protected readonly diaCurto = diaCurto;
    protected readonly diaMes = diaMes;
    protected readonly diaPorExtenso = diaPorExtenso;
    protected readonly ehHoje = ehHoje;
    protected readonly mesAno = mesAno;

    ngOnInit(): void {
        this.carregarMarcacoes();
    }

    ngAfterViewInit(): void {
        this.centralizarTira();
    }

    selecionar(aulaId: number): void {
        this.aulaSelecionadaId.set(aulaId);
        this.carregarMarcacoes();
        this.listaAberta.set(false);
        this.centralizarTira();
    }

    irParaAtrasada(): void {
        const primeira = this.atrasadas()[0];
        if (primeira) {
            this.selecionar(primeira.id);
        }
    }

    marcar(alunoId: number, presenca: Presenca): void {
        this.marcacoes.update(atual => {
            const copia = { ...atual };
            // Tocar de novo no mesmo botao desmarca: erro de dedo tem volta.
            if (copia[alunoId] === presenca) {
                delete copia[alunoId];
            } else {
                copia[alunoId] = presenca;
            }
            return copia;
        });
    }

    todosPresentes(): void {
        const todos: Record<number, Presenca> = {};
        for (const aluno of this.alunos()) {
            todos[aluno.id] = 'PRESENTE';
        }
        this.marcacoes.set(todos);
    }

    limpar(): void {
        this.marcacoes.set({});
    }

    salvar(): void {
        const aula = this.aulaAtual();
        if (!aula || this.semMarcar() > 0) {
            return;
        }

        const corrigindo = aula.situacao === 'SALVA';
        this.service.salvarChamada(aula.id, this.marcacoes());

        this.mensagens.add({
            severity: 'success',
            summary: corrigindo ? 'Correção salva' : 'Chamada salva',
            detail: corrigindo
                ? `Aula de ${this.diaPorExtenso(aula.data)}, ${this.diaMes(aula.data)}.`
                : this.faltas() > 0
                    ? `${this.faltas()} falta${this.faltas() > 1 ? 's' : ''} registrada${this.faltas() > 1 ? 's' : ''}.`
                    : 'Turma completa.'
        });
    }

    confirmarCancelamento(motivo: string): void {
        const aula = this.aulaAtual();
        if (!aula) {
            return;
        }
        this.service.cancelarAula(aula.id, motivo);
        this.motivosAbertos.set(false);
        this.mensagens.add({
            severity: 'info',
            summary: 'Aula cancelada',
            detail: `Motivo: ${motivo.toLowerCase()}. Ninguém recebeu falta.`
        });
    }

    desfazerCancelamento(): void {
        const aula = this.aulaAtual();
        if (aula) {
            this.service.desfazerCancelamento(aula.id);
        }
    }

    /** Agrupa as aulas por mes para a lista "ver todas", da mais nova para a mais velha. */
    readonly aulasPorMes = computed(() => {
        const grupos: { mes: string; aulas: Aula[] }[] = [];
        for (const aula of [...this.aulas()].reverse()) {
            const mes = mesAno(aula.data);
            const ultimo = grupos[grupos.length - 1];
            if (ultimo && ultimo.mes === mes) {
                ultimo.aulas.push(aula);
            } else {
                grupos.push({ mes, aulas: [aula] });
            }
        }
        return grupos;
    });

    private contar(presenca: Presenca): number {
        const marcadas = this.marcacoes();
        return this.alunos().filter(aluno => marcadas[aluno.id] === presenca).length;
    }

    private carregarMarcacoes(): void {
        const aula = this.aulaAtual();
        // Copia o objeto do service: editar aqui nao pode mexer no que esta salvo.
        this.marcacoes.set(aula ? { ...this.service.marcacoesDaAula(aula.id) } : {});
    }

    /** Deixa o chip selecionado no meio da tira, para ele nao nascer fora da tela. */
    private centralizarTira(): void {
        const elemento = this.tira()?.nativeElement;
        const alvo = elemento?.querySelector<HTMLElement>('[aria-current="true"]');
        if (elemento && alvo) {
            elemento.scrollLeft = alvo.offsetLeft - elemento.clientWidth / 2 + alvo.clientWidth / 2;
        }
    }

    protected iniciais(nome: string): string {
        const partes = nome.split(' ');
        return `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase();
    }
}
