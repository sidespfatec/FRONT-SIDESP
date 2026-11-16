import { Component, computed, inject, signal } from '@angular/core';
import { TabsModule } from 'primeng/tabs';

import { TeacherService } from '../teacher.service';
import { MyClassesComponent } from './my-classes/my-classes.component';
import { PersonalDataComponent } from './personal-data/personal-data.component';
import { ScheduleComponent } from './schedule/schedule.component';

/**
 * Perfil do professor: cartao de identificacao + tres abas.
 *
 * Esta tela nao guarda dado nenhum. Ela le do TeacherService e distribui
 * para os tres componentes filhos. Toda a "inteligencia" aqui sao os computed().
 */
@Component({
    selector: 'app-profile',
    imports: [
        TabsModule, MyClassesComponent, ScheduleComponent, PersonalDataComponent
    ],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss'
})
export class ProfileComponent {

    private readonly service = inject(TeacherService);

    // Signals vindos do service. Nao sao copias: se o service alterar, a tela redesenha.
    readonly perfil = this.service.perfil;
    readonly turmas = this.service.turmas;

    // Aba aberta. O tipo acompanha o do p-tabs, que aceita string ou numero.
    readonly abaAtiva = signal<string | number | undefined>('turmas');

    // computed() recalcula sozinho quando 'turmas' muda, e so quando muda.
    readonly totalTurmas = computed(() => this.turmas().length);

    readonly totalAlunos = computed(() =>
        this.turmas().reduce((soma, turma) => soma + turma.totalAlunos, 0)
    );

    readonly turmasPendentes = computed(() =>
        this.turmas().filter(turma => turma.chamadaPendente)
    );

    readonly chamadasPendentes = computed(() => this.turmasPendentes().length);

    /** Monta 'Infantil A e Infantil B' para a faixa amarela de aviso. */
    readonly nomesPendentes = computed(() => {
        const nomes = this.turmasPendentes().map(turma => turma.nome);
        if (nomes.length <= 1) {
            return nomes.join('');
        }
        return `${nomes.slice(0, -1).join(', ')} e ${nomes[nomes.length - 1]}`;
    });

    /** A faixa de aviso leva para a aba das turmas, onde ele resolve a pendencia. */
    irParaTurmas(): void {
        this.abaAtiva.set('turmas');
    }
}
