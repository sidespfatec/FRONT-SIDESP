import { Component, computed, inject, input, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import {
    Aula, Ocorrencia, RegistroDeAula, TipoOcorrencia,
    OCORRENCIAS_QUE_ABREM_CHAMADO, ROTULO_OCORRENCIA, ROTULO_STATUS,
    diaMes, diaPorExtenso, ehHoje
} from '../../teacher.model';
import { TeacherService } from '../../teacher.service';

/**
 * Aba "Diário".
 *
 * Sao duas coisas diferentes no mesmo lugar, de proposito separadas:
 *   - o conteudo da aula, que e memoria pedagogica e fica no historico;
 *   - a ocorrencia, que pode virar chamado de manutencao para a secretaria.
 *
 * Material e estrutura abrem chamado com status. Se a lampada queimada virar
 * so um texto no diario, ninguem conserta e o professor para de registrar.
 */
@Component({
    selector: 'app-class-log',
    imports: [ButtonModule, ToastModule],
    providers: [MessageService],
    templateUrl: './class-log.component.html',
    styleUrl: './class-log.component.scss'
})
export class ClassLogComponent {

    readonly turmaId = input.required<number>();

    private readonly service = inject(TeacherService);
    private readonly mensagens = inject(MessageService);

    readonly aulas = computed(() => this.service.aulasDaTurma(this.turmaId()));

    /** Aula que o formulario preenche: a de hoje, ou a mais recente que houve. */
    readonly aulaDeHoje = computed<Aula | undefined>(() => {
        const lista = this.aulas();
        return lista.find(aula => ehHoje(aula.data)) ?? lista[lista.length - 1];
    });

    readonly registros = computed(() => this.service.registrosDaTurma(this.turmaId()));

    readonly conteudo = signal('');
    readonly descricao = signal('');
    readonly tiposSelecionados = signal<TipoOcorrencia[]>([]);

    protected readonly tipos = Object.keys(ROTULO_OCORRENCIA) as TipoOcorrencia[];
    protected readonly rotuloOcorrencia = ROTULO_OCORRENCIA;
    protected readonly rotuloStatus = ROTULO_STATUS;
    protected readonly diaMes = diaMes;
    protected readonly diaPorExtenso = diaPorExtenso;

    alternarTipo(tipo: TipoOcorrencia): void {
        this.tiposSelecionados.update(atuais =>
            atuais.includes(tipo) ? atuais.filter(item => item !== tipo) : [...atuais, tipo]
        );
    }

    selecionado(tipo: TipoOcorrencia): boolean {
        return this.tiposSelecionados().includes(tipo);
    }

    salvar(): void {
        const aula = this.aulaDeHoje();
        const texto = this.conteudo().trim();

        if (!aula || (!texto && this.tiposSelecionados().length === 0)) {
            this.mensagens.add({
                severity: 'warn',
                summary: 'Nada para salvar',
                detail: 'Escreva o conteúdo da aula ou marque uma ocorrência.'
            });
            return;
        }

        const ocorrencias: Ocorrencia[] = this.tiposSelecionados().map(tipo => ({
            tipo,
            descricao: this.descricao().trim() || ROTULO_OCORRENCIA[tipo],
            status: 'ABERTO'
        }));

        const registro: RegistroDeAula = { aulaId: aula.id, conteudo: texto, ocorrencias };
        this.service.salvarRegistro(registro);

        const abriuChamado = ocorrencias.some(o => OCORRENCIAS_QUE_ABREM_CHAMADO.includes(o.tipo));

        this.conteudo.set('');
        this.descricao.set('');
        this.tiposSelecionados.set([]);

        this.mensagens.add({
            severity: 'success',
            summary: 'Registro salvo',
            detail: abriuChamado ? 'Chamado aberto para a secretaria.' : 'Aula registrada no diário.'
        });
    }

    /** Acha a data da aula a partir do id guardado no registro. */
    protected dataDoRegistro(aulaId: number): string {
        const aula = this.aulas().find(item => item.id === aulaId);
        return aula ? `${diaPorExtenso(aula.data)}, ${diaMes(aula.data)}` : '';
    }

    /** Textarea nao tem binding de signal pronto: lemos o valor do evento. */
    protected escrever(alvo: EventTarget | null, destino: 'conteudo' | 'descricao'): void {
        const valor = (alvo as HTMLTextAreaElement).value;
        if (destino === 'conteudo') {
            this.conteudo.set(valor);
        } else {
            this.descricao.set(valor);
        }
    }
}
