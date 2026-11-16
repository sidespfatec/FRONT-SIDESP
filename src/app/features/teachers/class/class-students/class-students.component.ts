import { Component, computed, inject, input, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';

import { AlunoDaTurma } from '../../teacher.model';
import { TeacherService } from '../../teacher.service';

/**
 * Aba "Alunos".
 *
 * Esta tela foi desenhada para o pior momento: o professor molhado, com uma
 * crianca passando mal, precisando de um telefone em tres segundos. Por isso a
 * ordem na ficha e saude primeiro, contato de emergencia depois, endereco por
 * ultimo -- e o botao de ligar e o maior da tela.
 */
@Component({
    selector: 'app-class-students',
    imports: [ButtonModule, DrawerModule],
    templateUrl: './class-students.component.html',
    styleUrl: './class-students.component.scss'
})
export class ClassStudentsComponent {

    readonly turmaId = input.required<number>();

    private readonly service = inject(TeacherService);

    readonly alunos = computed(() => this.service.alunosDaTurma(this.turmaId()));

    readonly comFichaSaude = computed(() =>
        this.alunos().filter(aluno => aluno.fichaSaude).length
    );

    readonly frequenciaMedia = computed(() => {
        const lista = this.alunos();
        if (!lista.length) {
            return 0;
        }
        return Math.round(lista.reduce((soma, aluno) => soma + aluno.frequencia, 0) / lista.length);
    });

    /** Aluno mostrado na ficha. */
    readonly selecionado = signal<AlunoDaTurma | null>(null);

    /**
     * Visibilidade da gaveta, em signal proprio.
     *
     * Nao da para derivar de "selecionado !== null" com [visible] + (visibleChange):
     * o p-drawer emite visibleChange TAMBEM ao abrir, e o manipulador fechava
     * a ficha no mesmo instante em que ela abria.
     */
    readonly fichaAberta = signal(false);

    abrirFicha(aluno: AlunoDaTurma): void {
        this.selecionado.set(aluno);
        this.fichaAberta.set(true);
    }

    /** tel: abre o discador do celular com o numero ja preenchido. */
    protected linkTelefone(telefone: string): string {
        return `tel:${telefone.replace(/\D/g, '')}`;
    }

    protected iniciais(nome: string): string {
        const partes = nome.split(' ');
        return `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase();
    }

    /** Resume a ficha numa etiqueta curta para a lista. */
    protected etiquetaSaude(aluno: AlunoDaTurma): string {
        const ficha = aluno.fichaSaude;
        if (!ficha) {
            return '';
        }
        const temAlergia = ficha.alergias && !ficha.alergias.toLowerCase().startsWith('nenhuma');
        return temAlergia ? 'alergia grave' : ficha.condicoes;
    }
}
