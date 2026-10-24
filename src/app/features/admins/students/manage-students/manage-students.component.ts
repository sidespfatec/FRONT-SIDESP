import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ToggleButtonModule } from 'primeng/togglebutton';

import { BannerComponent } from '../../../../component/banner/banner.component';
import { FooterComponent } from '../../../../component/footer/footer.component';
import { NavbarDesktopAdminComponent } from '../../../../component/navbar-desktop-admin/navbar-desktop-admin.component';

import {
    ALUNOS, Aluno, idadeDe, matriculaAtual, pendenciasDe, POLOS_OPCOES, TURMAS_OPCOES
} from '../student.model';

@Component({
    selector: 'app-manage-students',
    standalone: true,
    imports: [
        CommonModule, FormsModule,
        BannerComponent, FooterComponent, NavbarDesktopAdminComponent,
        ButtonModule, CardModule, InputTextModule, IconFieldModule, InputIconModule,
        SelectModule, TagModule, ToggleButtonModule
    ],
    templateUrl: './manage-students.component.html',
    styleUrl: './manage-students.component.scss'
})
export class ManageStudentsComponent {

    readonly polosOpcoes = POLOS_OPCOES;
    readonly turmasOpcoes = TURMAS_OPCOES;

    busca = signal('');
    polo = signal<string | null>(null);
    turma = signal<string | null>(null);
    soAtivos = signal(true);
    soPendentes = signal(false);

    readonly alunos = signal<Aluno[]>(ALUNOS);

    readonly alunosFiltrados = computed(() => {
        const termo = this.busca().trim().toLowerCase();

        return this.alunos().filter(aluno => {
            const matricula = matriculaAtual(aluno);

            if (termo && !aluno.nome.toLowerCase().includes(termo) && !aluno.cpf.includes(termo)) {
                return false;
            }
            if (this.polo() && matricula?.polo !== this.polo()) {
                return false;
            }
            if (this.turma() && `${matricula?.modalidade}, ${matricula?.turma}` !== this.turma()) {
                return false;
            }
            if (this.soAtivos() && aluno.situacao !== 'ativo') {
                return false;
            }
            if (this.soPendentes() && pendenciasDe(aluno) === 0) {
                return false;
            }
            return true;
        });
    });

    readonly totalPendentes = computed(() =>
        this.alunosFiltrados().filter(aluno => pendenciasDe(aluno) > 0).length
    );

    constructor(private router: Router) { }

    idade(aluno: Aluno): number {
        return idadeDe(aluno.nascimento);
    }

    ondeEstuda(aluno: Aluno): string {
        const matricula = matriculaAtual(aluno);
        if (!matricula) { return 'sem turma'; }
        return `${matricula.modalidade}, ${matricula.turma}, ${matricula.polo}`;
    }

    temPendencia(aluno: Aluno): boolean {
        return pendenciasDe(aluno) > 0;
    }

    abrirFicha(aluno: Aluno): void {
        this.router.navigate(['/admin/alunos', aluno.id]);
    }

    novoAluno(): void {
    }
}
