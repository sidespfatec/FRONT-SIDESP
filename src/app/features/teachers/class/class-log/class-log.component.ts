import { Component, Input } from '@angular/core';

import { Aula, RegistroDeAula, dataLocal, diaMes, diaPorExtenso, ehHoje }
    from '../../teacher.model';
import { TeacherService } from '../../teacher.service';

@Component({
    selector: 'app-class-log',
    imports: [],
    templateUrl: './class-log.component.html',
    styleUrl: './class-log.component.scss'
})
export class ClassLogComponent {

    @Input() turmaId = 0;

    /** O que está sendo digitado. Só vira registro quando ele salva. */
    conteudo = '';
    ocorrencia = '';

    diaPorExtenso = diaPorExtenso;
    diaMes = diaMes;

    constructor(private service: TeacherService) { }

    get registros(): RegistroDeAula[] { return this.service.registros(); }

    /**
     * A aula que o registro vai gravar: a de hoje, ou a última que já
     * aconteceu. Aula futura não entra — não dá pra registrar o que ainda
     * não foi dado.
     */
    get aulaAlvo(): Aula | undefined {
        const hoje = new Date();

        const passadas = this.service.aulasDaTurma(this.turmaId)
            .filter(aula => dataLocal(aula.data) <= hoje);

        // A lista vem da mais antiga pra mais nova: a última é a mais recente
        return passadas[passadas.length - 1];
    }

    /** Lê o que foi digitado e guarda no campo certo. */
    escrever(alvo: EventTarget | null, campo: 'conteudo' | 'ocorrencia'): void {
        // O alvo chega como EventTarget, o tipo genérico de "coisa que recebeu
        // um evento". O TypeScript não sabe que ali tem .value — daí o 'as'.
        const texto = (alvo as HTMLTextAreaElement).value;

        if (campo === 'conteudo') {
            this.conteudo = texto;
        } else {
            this.ocorrencia = texto;
        }
    }

    /** Mostra a data de um registro antigo. */
    dataDoRegistro(aulaId: number): string {
        const aula = this.service.aulasDaTurma(this.turmaId).find(a => a.id === aulaId);
        return aula ? `${diaPorExtenso(aula.data)}, ${diaMes(aula.data)}` : '';
    }

    salvar(): void {
        const aula = this.aulaAlvo;

        // trim() tira os espaços das pontas: só espaço não conta como texto
        if (!aula || this.conteudo.trim() === '') { return; }

        this.service.salvarRegistro({
            aulaId: aula.id,
            conteudo: this.conteudo.trim(),
            // || undefined: campo vazio não vai como '' pro back
            ocorrencia: this.ocorrencia.trim() || undefined
        });

        this.conteudo = '';
        this.ocorrencia = '';
    }
}